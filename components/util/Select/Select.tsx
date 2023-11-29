import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import styles from "./Select.module.scss";

interface Props<T extends FieldValues> {
  register?: UseFormRegister<T>;
  registerLabel?: Path<T>;
  options:
    | {
        value: string;
        label: string;
        district?: string;
      }[]
    | null;
  className?: string | string[];
}

const Select = <T extends FieldValues>({
  register,
  registerLabel,
  options,
  className,
}: Props<T>) => {
  return (
    <div className={styles.select + " " + className}>
      <select {...(register && registerLabel ? register(registerLabel) : {})}>
        {options?.map((option) => (
          <option value={option.value} className={styles.select__option}>
            {option.district && <p>{option.district}</p>}
            <span>{option.label}</span>
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
