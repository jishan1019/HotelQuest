import { Router } from "express";

const router = Router();

const moduleRoutes = [
  {
    path: "/users",
    route: "",
  },
  {
    path: "/auth",
    route: "",
  },
  {
    path: "/rooms",
    route: "",
  },
  {
    path: "/bookings",
    route: "",
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
