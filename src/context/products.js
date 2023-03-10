import React, {useReducer } from "react";
import axios from "axios";
import url from "../utils/URL";
import { SIDEBAR_OPEN, SIDEBAR_CLOSE } from '../action'
import reducer from '../reducers/products_reducer'
import { featuredProducts, flattenProducts, paginate } from "../utils/helpers";
export const ProductContext = React.createContext();

export default function ProductProvider({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] =React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [products, setProducts] = React.useState([]);
  const [featured, setFeatured] = React.useState([]);
  // extra state values
  const [sorted, setSorted] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [filters, setFilters] = React.useState({
    search: "",
    category: "all",
    shipping: false,
    price: "all"
  });
  const [state, dispatch] = useReducer(reducer, isSidebarOpen)
  const openSidebar = () => {
    dispatch({ type: SIDEBAR_OPEN })
  }
  const closeSidebar = () => {
    dispatch({ type: SIDEBAR_CLOSE })
  }
  const changePage = index => {
    setPage(index);
  };
  const updateFilters = e => {
    const type = e.target.type;
    const filter = e.target.name;
    const value = e.target.value;
    let filterValue;
    if (type === "checkbox") {
      filterValue = e.target.checked;
    } else if (type === "radio") {
      value === "all" ? (filterValue = value) : (filterValue = parseInt(value));
    } else {
      filterValue = value;
    }
    setFilters({ ...filters, [filter]: filterValue });
  };

  React.useEffect(() => {
    setLoading(false);
      axios.get(`https://back-api.vercel.app/service?fbclid=IwAR2I-ryvMj9Czkyey_VqNGTb3qTGsdYBHt7-DmMFXVOb0VtWFloLgkBZr0s`).then(response => {  //axios.get(`${url}/api/products`, {
      const featured = featuredProducts(flattenProducts(response.data));
      const products = flattenProducts(response.data);
      setProducts(products);
      setSorted(paginate(products));
      setFeatured(featured);
      setLoading(false);
    });
    return () => {};
  }, []);
  React.useLayoutEffect(() => {
    let newProducts = [...products].sort((a, b) => a.price - b.price);
    const { search, category, shipping, price } = filters;
    //
    if (category !== "all") {
      newProducts = newProducts.filter(item => item.category === category);
    }
    if (shipping !== false) {
      newProducts = newProducts.filter(item => item.free_shipping === shipping);
    }
    if (price !== "all") {
      newProducts = newProducts.filter(item => {
        if (price === 0) {
          return item.price < 300;
        } else if (price === 300) {
          return item.price > 300 && item.price < 650;
        } else {
          return item.price > 650;
        }
      });
    }
    // if (search !== "") {
    //   newProducts = newProducts.filter(item => {
    //     let title = item.title.toLowerCase().trim();
    //     return title.startsWith(search) ? item : null;
    //   });
    // }
    if (search !== ""){
      newProducts = newProducts.filter(item => {
        item.title.toLowerCase().startsWith(search)
      })
    }

    setPage(0);

    setSorted(paginate(newProducts));
  }, [filters, products]);
  return (
    <ProductContext.Provider
      value={{
        ...state,
        products,
        loading,
        featured,
        sorted,
        page,
        changePage,
        filters,
        updateFilters,
        openSidebar,
        closeSidebar
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}