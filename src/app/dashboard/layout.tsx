import NavbarUser from "@/components/navbars/navbar-user.component";
import Footer from "@/components/footer/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50">
        <NavbarUser />
      </div>
      <main>{children}</main>
      <Footer />
    </>
  );
}
