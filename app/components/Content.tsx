export default function Content({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col h-full bg-[#F1FFF3] rounded-tl-[70px] rounded-tr-[70px] p-6 items-center">
      {children}
    </div>
  );
}
