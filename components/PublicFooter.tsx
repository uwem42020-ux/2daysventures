import InstallButton from "./InstallButton";

export default function PublicFooter() {
  return (
    <footer className="bg-gray-100 border-t mt-16 py-8 text-center text-sm text-gray-600">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4">
        <InstallButton />
        <p>&copy; {new Date().getFullYear()} 2days Ventures Limited. All rights reserved.</p>
      </div>
    </footer>
  );
}