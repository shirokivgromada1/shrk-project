import {
  ButtonTypeMap,
  ExtendButtonBase,
  Button as MaterialButton,
  Tooltip,
  Zoom,
} from "@mui/material";
import styles from "./Button.module.scss";
import { CSSProperties, MouseEvent } from "react";
import classNames from "classnames";

interface Props {
  type: "submit" | "reset" | "button" | undefined;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  children?: React.ReactNode;
  disabled?: boolean;
  toolTip?: string;
  style?: CSSProperties;
  classNames?: string[] | string;
}

const Button = ({
  type,
  children,
  onClick,
  disabled,
  toolTip,
  style,
  classNames: className,
  ...props
}: Props) => {
  return (
    <Tooltip title={toolTip} TransitionComponent={Zoom} followCursor>
      <span>
        <MaterialButton
          style={{ padding: "9px 18px", borderRadius: 5, ...style }}
          className={classNames(className, styles.button)}
          type={type}
          onClick={onClick}
          disabled={disabled}
          {...props}
        >
          {children}
        </MaterialButton>
      </span>
    </Tooltip>
  );
};

export default Button;
