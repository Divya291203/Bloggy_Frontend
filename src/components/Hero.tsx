import { Link } from "react-router-dom";
import { CarouselPlugin } from "./CarouselPlugin";
import { Button } from "./ui/button";
import { API_PATHS } from "@/utils/apiPaths";
const Hero: React.FC = () => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-1 min-h-[400px] md:h-[400px] items-center">
			<div className="flex flex-col gap-3 justify-center order-2 md:order-1">
				<h1 className="text-4xl md:text-6xl font-bold mb-4">
					<span className="text-primary">Tech</span>. Learning.{" "}
					<span className="text-primary">Life</span>.
				</h1>
				<p className="text-base md:text-lg text-gray-600">
					A space for developers and curious minds to explore technology, share
					experiences, and discover what's worth knowing.
				</p>
				<div className="flex flex-col sm:flex-row gap-4">
					<Link to={API_PATHS.POST.GET_ALL_POSTS}>
						<Button className="w-full sm:w-auto cursor-pointer">
							Read More
						</Button>
					</Link>
					<Link to="#" >
						<Button variant="outline-primary" className="w-full sm:w-auto cursor-pointer">
							Subscribe
						</Button>
					</Link>
				</div>
			</div>
			<div className="order-1 md:order-2">
				<CarouselPlugin className="h-[250px] md:h-full w-full p-2 md:p-6" />
			</div>
		</div>
	);
};

export default Hero;
