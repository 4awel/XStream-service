import { CategoryPage } from '@page-ui/Categories/CategoryPage';
import type { ReactNode } from 'react';

interface CategoryRouteProps {
    params: Promise<{ slug: string }>;
}

const CategoryRoute = async ({ params }: CategoryRouteProps): Promise<ReactNode> => {
    const { slug } = await params;
    return <CategoryPage key={slug} slug={slug} />;
};

export default CategoryRoute;
