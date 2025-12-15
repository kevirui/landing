import { useRipple, RippleContainer } from '@components/ui/Ripple';
import { StaggeredItem } from '@components/ui/StaggeredItem';

interface MetricCardProps {
  id: string;
  value: string;
  label: string;
  imageSrc: string;
  imageAlt: string;
  index: number;
}

export default function MetricCard({
  id,
  value,
  label,
  imageSrc,
  imageAlt,
  index,
}: MetricCardProps) {
  const { ripples, createRipple } = useRipple();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    createRipple(e);
    window.dispatchEvent(
      new CustomEvent(`open-modal-${id}`, { detail: { modalId: id } })
    );
  };

  return (
    <StaggeredItem index={index} staggerDelay={150}>
      <div
        id={`card-${id}`}
        className="relative rounded-2xl overflow-hidden aspect-4/3 group cursor-pointer transition-transform duration-300 ease-out hover:scale-105 active:scale-95 text-white"
        onClick={handleClick}
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          className="absolute inset-0 w-full h-full object-cover block"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 to-black/40"></div>
        <div className="relative h-full flex flex-col justify-center items-center p-4 sm:p-6 md:p-8">
          <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-montserrat font-bold mb-2 sm:mb-3">
            {value}
          </div>
          <div className="text-sm sm:text-base md:text-lg lg:text-xl font-montserrat font-semibold text-center px-2">
            {label}
          </div>
        </div>
        <RippleContainer ripples={ripples} />
      </div>
    </StaggeredItem>
  );
}
