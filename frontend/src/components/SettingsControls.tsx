import Button from './Button';

interface SettingsControlsProps {
  apply?: () => void;
  discard?: () => void;
}

export default ({apply, discard}: SettingsControlsProps) => (
  <div className="flex ">
    <div className="ml-auto flex gap-4">
      <Button onClick={apply}>Apply</Button>
      <Button onClick={discard}>Discard</Button>
    </div>
  </div>
);
