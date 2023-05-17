import ShadowBox from './ShadowBox';

interface ModalProps extends React.HTMLProps<HTMLDivElement> {
  open: boolean;
  close: () => void;
}

export default ({open, close, children}: ModalProps) => {
  return open ? (
    <div
      className="absolute top-0 left-0 w-screen h-screen bg-light-background/50 dark:bg-dark-background/50 backdrop-blur-[1px] z-[999]"
      onClick={close}
    >
      <ShadowBox
        className="centered z-[1000]"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </ShadowBox>
    </div>
  ) : null;
};
