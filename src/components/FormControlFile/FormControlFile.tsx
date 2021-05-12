import {
  ChangeEvent,
  FC,
  HTMLProps,
  useCallback,
  useEffect,
  useState,
} from 'react';

export interface FormControlFileProps extends HTMLProps<HTMLInputElement> {
  onChange?(value: any): any;
  value?: string;
  getOptionLabel?(value: any): string;
}

const FormControlFile: FC<FormControlFileProps> = ({
  onChange = () => {},
  value,
  ...props
}) => {
  const [reader, setReader] = useState<FileReader>();

  useEffect(() => {
    setReader(new FileReader());
  }, []);

  useEffect(() => {
    if (!reader) {
      return;
    }
    reader.addEventListener(
      'load',
      () => {
        onChange(reader.result);
      },
      false,
    );
  }, [onChange, reader]);

  const handleOnChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!reader) {
        return;
      }
      if (
        (event.target as HTMLInputElement)?.files &&
        (event.target as HTMLInputElement)?.files?.length
      ) {
        const { files } = (event.target as HTMLInputElement)!;
        if (files !== null) {
          reader.readAsDataURL(files[0]);
        }
      }
    },
    [reader],
  );

  return (
    <>
      <input type="file" onChange={handleOnChange} {...props} />
      {value && <div>{value && <img alt="preview" src={value} />}</div>}
    </>
  );
};

export default FormControlFile;
