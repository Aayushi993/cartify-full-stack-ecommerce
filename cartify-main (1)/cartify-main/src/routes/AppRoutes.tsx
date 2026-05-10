import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout/MainLayout";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import SuperAdminLayout from "../layouts/SuperAdminLayout/SuperAdminLayout";

import NotFound from "../pages/NotFound/NotFound";
import Home from "../pages/Home/Home";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import ProductListing from "../pages/ProductListing/ProductListing";

import Cart from "../pages/Cart/Cart";
import Checkout from "../pages/Checkout/Checkout";
import Orders from "../pages/Orders/Orders";
import OrderDetails from "../pages/OrderDetails/OrderDetails";
import Payment from "../pages/Payment/Payment";
import BecomeSeller from "../pages/BecomeSeller/BecomeSeller";

import Dashboard from "../pages/Admin/Dashboard";
import SellerOrders from "../pages/Admin/SellerOrders";
import Earnings from "../pages/Admin/Earnings";
import Products from "../pages/Admin/Products";

import SellerRequests from "../pages/Admin/SellerRequests";
import Users from "../pages/Admin/Users";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

import LoginForm from "../components/auth/LoginForm";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔥 PUBLIC (NO LAYOUT) */}
      

        {/* 🔥 MAIN USER APP */}
        <Route element={<MainLayout />}>

          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/products" element={<ProductListing />} />

          {/* USER PROTECTED */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute roles={["USER"]}>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute roles={["USER"]}>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute roles={["USER"]}>
                <Orders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute roles={["USER"]}>
                <OrderDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment"
            element={
              <ProtectedRoute roles={["USER"]}>
                <Payment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/become-seller"
            element={
              <ProtectedRoute roles={["USER"]}>
                <BecomeSeller />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Route>

        {/* 🔥 ADMIN PANEL */}
        <Route
  path="/admin"
  element={
    <ProtectedRoute roles={["ADMIN"]}>
      <AdminLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<Navigate to="dashboard" replace />} />
  <Route path="dashboard" element={<Dashboard />} />
  <Route path="products" element={<Products />} />
  <Route path="orders" element={<SellerOrders />} />
  <Route path="earnings" element={<Earnings />} />
</Route>

        {/* 🔥 SUPER ADMIN PANEL */}
        <Route
          path="/super-admin"
          element={
            <ProtectedRoute roles={["SUPER_ADMIN"]}>
              <SuperAdminLayout />
            </ProtectedRoute>
          }
        >
          {/* DEFAULT */}
          <Route index element={<Navigate to="requests" replace />} />

          <Route path="requests" element={<SellerRequests />} />
          <Route path="users" element={<Users />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;