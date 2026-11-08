import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import { AppShell } from "./components/marketplace";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import { Cart, Checkout } from "./pages/CartCheckout";
import { Account, Legal, Orders, Support, Wishlist } from "./pages/CustomerPages";

function Router() {
  return <Switch>
    <Route path="/" component={Home} />
    <Route path="/shop" component={ShopRoute} />
    <Route path="/category/:slug" component={CategoryRoute} />
    <Route path="/product/:slug" component={Product} />
    <Route path="/cart" component={Cart} />
    <Route path="/checkout" component={Checkout} />
    <Route path="/account" component={Account} />
    <Route path="/orders" component={Orders} />
    <Route path="/wishlist" component={Wishlist} />
    <Route path="/support" component={Support} />
    <Route path="/about"><Legal type="about" /></Route>
    <Route path="/contact"><Legal type="contact" /></Route>
    <Route path="/privacy"><Legal type="privacy" /></Route>
    <Route path="/terms"><Legal type="terms" /></Route>
    <Route path="/shipping"><Legal type="shipping" /></Route>
    <Route path="/returns"><Legal type="returns" /></Route>
    <Route path="/404" component={NotFound} />
    <Route component={NotFound} />
  </Switch>;
}

function CategoryRoute(_props: any) {
  const params = window.location.pathname.split("/").filter(Boolean);
  return <Shop categorySlug={params[1]} />;
}

function ShopRoute(_props: any) {
  return <Shop />;
}

function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><CartProvider><Toaster /><AppShell><Router /></AppShell></CartProvider></TooltipProvider></ThemeProvider></ErrorBoundary>;
}

export default App;
