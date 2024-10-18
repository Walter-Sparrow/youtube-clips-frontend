import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => {
    return (
      <div className="w-screen h-screen bg-black bg-[url('assets/imgs/background.avif')] bg-cover bg-center flex flex-col">
        <Outlet />
      </div>
    );
  },
});
