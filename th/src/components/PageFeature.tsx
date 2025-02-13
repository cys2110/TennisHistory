import { Link } from "@tanstack/react-router";
import { FC, JSX } from "react";

interface PageFeatureProps {
    title: string;
    link?: string;
    icon?: JSX.Element;
}

const PageFeature: FC<PageFeatureProps> = ({title, link, icon}) => {

    return (
        <Link to={link} className="w-full">
            <div className="p-10 border-4 border-emerald-700 rounded-xl flex gap-2 items-center">
                {icon}
                <div className="text-2xl font-bold">{ title}</div>
            </div>
        </Link>
    )
}

export default PageFeature