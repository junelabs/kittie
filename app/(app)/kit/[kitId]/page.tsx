type Props = { params: Promise<{ kitId: string }> };

export default async function KitDetailPage({ params }: Props) {
  const { kitId } = await params;
  
  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold mb-2">Kit: {kitId}</h1>
      <p className="text-sm text-muted-foreground">Detail page coming soon. This will show your media kit editor.</p>
    </div>
  );
}