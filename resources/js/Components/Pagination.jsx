import { Link } from "@inertiajs/react";

export default function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="flex flex-wrap justify-center gap-1 mt-6 mb-4">
            {links.map((link, index) => {
                const isNull = !link.url;
                const isActive = link.active;
                
                let relativeUrl = link.url;
                if (relativeUrl) {
                    try {
                        //"http://localhost:8000/agenda?page=2" -> "/agenda?page=2"
                        const parsedUrl = new URL(relativeUrl);
                        relativeUrl = parsedUrl.pathname + parsedUrl.search;
                    } catch (error) {
                        //
                    }
                }

                const className = `px-4 py-2 text-sm rounded-md transition-all border ${
                    isActive
                        ? "bg-blue-600 text-white border-blue-600 font-bold"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                } ${isNull ? "opacity-50 cursor-not-allowed" : ""}`;

                if (isNull) {
                    return (
                        <span
                            key={index}
                            className={className}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                return (
                    <Link
                        key={index}
                        href={relativeUrl}
                        className={className}
                        preserveScroll
                    >
                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                    </Link>
                );
            })}
        </div>
    );
}