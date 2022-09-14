interface ButtonProps {
  children?: React.ReactNode;
  onClick: () => void;
}

export default function Button({ onClick, children, ...props }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg border-2 border-emerald-200 bg-emerald-50 p-2 transition duration-200 hover:bg-emerald-200"
      {...props}
    >
      {children}
    </button>
  );
}
