import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { CAROUSEL_IMAGES } from "@/utils/data";

export function CarouselPlugin({ className }: { className?: string }) {
	const plugin = React.useRef(
		Autoplay({ delay: 2000, stopOnInteraction: true })
	);

	return (
		<Carousel
			plugins={[plugin.current]}
			className={cn("w-full h-full", className)}
		>
			<CarouselContent className="h-full">
				{CAROUSEL_IMAGES.map((i) => (
					<CarouselItem key={i.id} className="h-full">
						<div className="h-[250px] md:h-[400px] rounded-lg overflow-hidden shadow-lg transform-gpu will-change-transform backface-hidden">
							<img
								src={i.image}
								alt={i.title}
								className="w-full h-full object-cover transform-gpu will-change-transform"
							/>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
		</Carousel>
	);
}
