import { Cookie } from 'universal-cookie';
import { serialize } from 'utils/objectTransformer';

import { HttpRequestError } from './httpRequestError';

export interface BaseResponse<T> {
  data: T;
  status: number;
}

class HttpRequest {
  private readonly getAuthorizationBearerToken: () =>
    | { Authorization: string }
    | Record<string, unknown>;

  private readonly getAuthorizationApiKey: () =>
    | { Authorization: string }
    | Record<string, unknown>;

  private readonly getAuthorizationBasicToken: () =>
    | { Authorization: string }
    | Record<string, unknown>;

  public useFetch: () => any;

  private serialize: (body: any, contentType: string) => any;

  private readonly defaults: {
    mode: string;
    headers: {
      Accept: string;
      Vary: string;
      'Content-Type': string;
    };
    method: string;
  };

  constructor(
    public fetch: any,
    public baseUrl: string,
    public universalCookies: Cookie,
  ) {
    const serializers: any = {
      'application/x-www-form-urlencoded': serialize,
      'application/json': JSON.stringify,
    };

    this.useFetch = () => fetch;

    this.getAuthorizationBearerToken = () => {
      const token = this.universalCookies.get('api_token');
      if (token) {
        return { Authorization: `Bearer ${token}`, 'API-Key': token };
      }
      return {};
    };

    this.getAuthorizationBasicToken = () => {
      const token = this.universalCookies.get('api_basic_token');
      if (token) {
        return { Authorization: `Basic ${token}` };
      }
      return {};
    };

    this.getAuthorizationApiKey = () => {
      const apiKey = this.universalCookies.get('api_key');
      if (apiKey) {
        return { 'Api-Key': apiKey };
      }
      return {};
    };

    this.serialize = (body: any, contentType: string) =>
      serializers[contentType](body);

    this.universalCookies = universalCookies;
    this.baseUrl = baseUrl;
    this.defaults = {
      method: 'POST',
      mode: baseUrl ? 'cors' : 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Vary:
          'Origin, Access-Control-Request-Headers, Access-Control-Request-Method',
        ...this.getAuthorizationApiKey(),
        ...this.getAuthorizationBearerToken(),
        ...this.getAuthorizationBasicToken(),
      },
    };
  }

  public post<T>(
    url: string,
    body?: any,
    options?: any,
  ): Promise<BaseResponse<T>> {
    return this.execute<T>(url, {
      method: 'POST',
      body,
      ...options,
    });
  }

  public put<T>(
    url: string,
    body: any,
    options?: any,
  ): Promise<BaseResponse<T>> {
    return this.execute(url, {
      method: 'PUT',
      body,
      ...options,
    });
  }

  public get<T>(url: string, options?: any): Promise<BaseResponse<T>> {
    return this.execute<T>(url, {
      method: 'GET',
      ...options,
    });
  }

  public delete(url: string, options?: any): Promise<any> {
    return this.execute(url, {
      method: 'DELETE',
      ...options,
    });
  }

  public request(url: string, options?: any): Promise<Response> {
    const { query, ...finalOptions } = options || { method: 'GET' };
    const formattedURL = !query ? url : `${url}?${serialize(query)}`;
    const mergedOptions = {
      ...this.defaults,
      ...finalOptions,
      headers: {
        ...this.defaults.headers,
        ...(options && options.headers),
        ...this.getAuthorizationApiKey(),
        ...this.getAuthorizationBearerToken(),
        ...this.getAuthorizationBasicToken(),
      },
    };

    const { body, headers } = mergedOptions;
    return this.useFetch()(`${this.baseUrl}${formattedURL}`, {
      ...mergedOptions,
      body: this.serialize(body, headers['Content-Type']),
    });
  }

  public execute<T>(url: string, options?: any): Promise<BaseResponse<T>> {
    return this.request(url, options).then(async (response: any) => {
      const contentType = response.headers.get('content-type');

      if (!contentType) {
        return { status: response.status };
      }
      if (process.browser && contentType.includes('application/octet-stream')) {
        return response.blob();
      }

      if (contentType.includes('application/pdf')) {
        return response.buffer();
      }
      if (
        response.status.toString().startsWith(4) ||
        response.status.toString().startsWith(5)
      ) {
        if (response.status === 401 && process.browser) {
          // window.location.href = '/?error=unauthorised';
          return { status: 401 };
        }
        throw new HttpRequestError(response.status, await response.json());
      }
      return {
        status: response.status,
        data: await response.json(),
      } as BaseResponse<T>;
    });
  }
}

export default HttpRequest;
