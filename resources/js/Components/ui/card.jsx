import { cn } from '../../lib/utils';

function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'bg-white rounded-[12px] p-[16px] relative w-full break-words',
        className,
      )}
      style={{ boxShadow: '0px 2px 4px -1px rgba(175, 182, 201, 0.2)' }}
      {...props}
    >
      {children}
    </div>
  );
}

export { Card };
