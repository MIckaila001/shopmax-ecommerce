import { CategoryListing } from "@/components/category/listing";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CategoryListing slug={slug} />;
}
