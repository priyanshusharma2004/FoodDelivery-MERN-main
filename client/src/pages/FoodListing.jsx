import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ProductCard from "../components/cards/ProductsCard";
import { filter } from "../utils/data";
import { CircularProgress, Slider } from "@mui/material";
import { getAllProducts } from "../api";

// Container layout
const Container = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: auto;
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  gap: 30px;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 20px 16px;
  }
  background: ${({ theme }) => theme.bg};
`;

// Sidebar Filters
const Filters = styled.div`
  padding: 20px 16px;
  flex: 1;
  width: 100%;
  max-width: 300px;
  @media (max-width: 700px) {
    max-width: 440px;
  }
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

// Product section
const Products = styled.div`
  flex: 2;
  padding: 20px 0px;
  width: 100%;
`;

// Responsive grid for cards
const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  justify-items: center;
  align-items: stretch;
  width: 100%;
`;

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 12px;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 500;
`;

const Item = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Selectableitem = styled.div`
  cursor: pointer;
  display: flex;
  border: 1px solid ${({ theme }) => theme.text_secondary + 50};
  color: ${({ theme }) => theme.text_secondary + 90};
  border-radius: 8px;
  padding: 2px 8px;
  font-size: 16px;
  width: fit-content;
  ${({ selected, theme }) =>
    selected &&
    `
  border: 1px solid ${theme.text_primary};
  color: ${theme.text_primary};
  background: ${theme.text_primary + 30};
  font-weight: 500;
  `}
`;

const FoodListing = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const getFilteredProductsData = async () => {
    setLoading(true);
    await getAllProducts(
      selectedCategories.length > 0
        ? `minPrice=${priceRange[0]}&maxPrice=${
            priceRange[1]
          }&categories=${selectedCategories.join(",")}`
        : `minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}`
    ).then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    getFilteredProductsData();
  }, [priceRange, selectedCategories]);

  return (
    <Container>
      <Filters>
        <Menu>
          {filter.map((filters) => (
            <FilterSection key={filters.name}>
              <Title>{filters.name}</Title>
              {filters.value === "price" ? (
                <Slider
                  aria-label="Price"
                  defaultValue={priceRange}
                  min={0}
                  max={1000}
                  valueLabelDisplay="auto"
                  marks={[
                    { value: 0, label: "₹0" },
                    { value: 1000, label: "₹1000" },
                  ]}
                  onChange={(e, newValue) => setPriceRange(newValue)}
                />
              ) : filters.value === "category" ? (
                <Item>
                  {filters.items.map((item) => (
                    <Selectableitem
                      key={item}
                      selected={selectedCategories.includes(item)}
                      onClick={() =>
                        setSelectedCategories((prevCategories) =>
                          prevCategories.includes(item)
                            ? prevCategories.filter(
                                (category) => category !== item
                              )
                            : [...prevCategories, item]
                        )
                      }
                    >
                      {item}
                    </Selectableitem>
                  ))}
                </Item>
              ) : null}
            </FilterSection>
          ))}
        </Menu>
      </Filters>

      <Products>
        <CardWrapper>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </>
          )}
        </CardWrapper>
      </Products>
    </Container>
  );
};

export default FoodListing;
