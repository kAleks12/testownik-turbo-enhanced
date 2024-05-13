import React from "react";
import { ILoaderProps } from "./ILoaderProps";
import styles from "./Loader.module.scss";

const Loader = (props: ILoaderProps) => {
  const { isLoading: isLoadingProps, isImmediate } = props;
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  React.useEffect(() => {
    if (isLoadingProps === isLoading) return;
    if (isLoadingProps && !isLoading && !isImmediate) {
      setTimeout(() => {
        setIsLoading(true);
      }, 200);
    } else {
      setIsLoading(isLoadingProps);
    }
  }, [isImmediate, isLoading, isLoadingProps]);
  const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };
  return (
    <>
      {isLoading && (
        <div className={styles.container} onClick={onClick}>
          <div className={styles.ldsFacebook}>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
    </>
  );
};

export default Loader;
