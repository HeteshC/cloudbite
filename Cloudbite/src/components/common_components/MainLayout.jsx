// components/common_components/MainLayout.jsx
import React from "react";
import Header from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { Routes, Route } from "react-router-dom";
import { PrivateRoute, PublicRoute } from "../auth_components/AuthManager";
import PageTitle from "./PageTitle";

// Pages
import Homepage from "../../pages/common_pages/Home";
import PageNotFound from "../../pages/common_pages/PageNotFound";
import AboutUs from "../../pages/common_pages/AboutUs";
import Register from "../../pages/user_pages/Register";
import Login from "../../pages/user_pages/Login";
import Dashboard from "../../pages/user_pages/Dashboard";
import Profile from "../../pages/user_pages/Profile";
import UpdateProfile from "../../pages/user_pages/UpdateProfile";
import ForgotPassword from "../../pages/user_pages/ForgotPassword";
import ResetPassword from "../../pages/user_pages/ResetPassword";

// blog pages
import AllBlogs from "../../pages/blog_pages/AllBlogs";
import SingleBlog from "../../pages/blog_pages/SingleBlog";

// contact page
import ContactUs from "../../pages/ContactUs/ContactUs";

// subscription page
import Subscriptions from "../../pages/subscription_pages/Subscriptions";
import SearchProducts from "../../pages/product_pages/SearchProducts";

// shop pages
import Shop from "../../pages/shop_pages/Shop";
import SingleProduct from "../../pages/shop_pages/SingleProduct";

// cart pages
import CartPage from "../../pages/Cart/Cart";
import PlaceOrder from "../../pages/PlaceOrder/PlaceOrder";
import CheckoutPage from "../../pages/cart_pages/CheckoutPage";
import MyOrders from "../../pages/orders_page/MyOrders";
import ThankYou from "../../pages/orders_page/ThankYou";

// wishlist page
import Wishlist from "../../pages/wishlist_pages/Wishlist";

// food detail page
import SingleFood from "../SingleFoodPage/SingleFood";
import ExploreCategory from "../ExploreCategory/ExploreCaterory";
import ExploreKitchens from "../ExploreKitchens/ExploreKitchens";
import FoodDisplay from "../FoodDisplay/FoodDisplay";
import Menu from "../../pages/Menu/Menu";

const MainLayout = () => {
  return (
    <div className="min-h-screen text-gray-900">
      <Header />
      <main className="flex-grow container py-6">
        <Routes>
          <Route
            path="/"
            element={
              <PageTitle title="Home">
                <Homepage />
              </PageTitle>
            }
          />
          <Route
            path="/home"
            element={
              <PageTitle title="Home">
                <Homepage />
              </PageTitle>
            }
          />
          <Route
            path="/homepage"
            element={
              <PageTitle title="Home">
                <Homepage />
              </PageTitle>
            }
          />
          <Route
            path="/contact-us"
            element={
              <PageTitle title="Contact Us">
                <ContactUs />
              </PageTitle>
            }
          />
          <Route
            path="/about-us"
            element={
              <PageTitle title="About Us">
                <AboutUs />
              </PageTitle>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <PageTitle title="Login">
                  <Login />
                </PageTitle>
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <PageTitle title="Register">
                  <Register />
                </PageTitle>
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute allowedRoles={["user", "superadmin"]}>
                <PageTitle title="User Dashboard">
                  <Dashboard />
                </PageTitle>
              </PrivateRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/single-product/:id" element={<SingleProduct />} />
          <Route
            path="/profile/:id"
            element={
              <PrivateRoute>
                <PageTitle title="Profile">
                  <Profile />
                </PageTitle>
              </PrivateRoute>
            }
          />
          <Route
            path="/update-profile/:id"
            element={
              <PrivateRoute>
                <PageTitle title="Update Profile">
                  <UpdateProfile />
                </PageTitle>
              </PrivateRoute>
            }
          />
          <Route
            path="/all-blogs"
            element={
              <PageTitle title="All Blogs">
                <AllBlogs />
              </PageTitle>
            }
          />
          <Route
            path="/single-blog/:id"
            element={
              <PageTitle title="Single Blog">
                <SingleBlog />
              </PageTitle>
            }
          />
          <Route
            path="/search-products"
            element={
              <PageTitle title="Search Products">
                <SearchProducts />
              </PageTitle>
            }
          />
          <Route
            path="/cart"
            element={
              <PageTitle title="Cart">
                <CartPage />
              </PageTitle>
            }
          />
          <Route
            path="/place-order"
            element={
              <PageTitle title="Place Order">
                <PlaceOrder />
              </PageTitle>
            }
          />
          <Route
            path="/checkout"
            element={
              <PageTitle title="Checkout">
                <CheckoutPage />
              </PageTitle>
            }
          />
          <Route
            path="/my-orders"
            element={
              <PageTitle title="Myorders">
                <MyOrders />
              </PageTitle>
            }
          />
          <Route
            path="/thank-you"
            element={
              <PageTitle title="ThankYou">
                <ThankYou />
              </PageTitle>
            }
          />
          <Route
            path="/wishlist"
            element={
              <PageTitle title="Wishlist">
                <Wishlist />
              </PageTitle>
            }
          />
          <Route
            path="/food/:id"
            element={
              <PageTitle title="Food Details">
                <SingleFood />
              </PageTitle>
            }
          />
          <Route
            path="/cloud-kitchens"
            element={
              <PageTitle title="Explore Kitchens">
                <ExploreKitchens />
              </PageTitle>
            }
          />
          <Route
            path="/explore-category"
            element={
              <PageTitle title="Explore Category">
                <ExploreCategory />
              </PageTitle>
            }
          />
          <Route
            path="/menu"
            element={
              <PageTitle title="Menu">
                <Menu />
              </PageTitle>
            }
          /> 
          <Route
            path="/food-display"
            element={
              <PageTitle title="Food Display">
                <FoodDisplay />
              </PageTitle>
            }
          />
          <Route
            path="/page-not-found"
            element={
              <PageTitle title="404 Not Found">
                <PageNotFound />
              </PageTitle>
            }
          />
          <Route
            path="/*"
            element={
              <PageTitle title="404 Not Found">
                <PageNotFound />
              </PageTitle>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
