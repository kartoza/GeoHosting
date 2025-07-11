import React, { useEffect, useState } from "react";
import { Input, Select } from "@chakra-ui/react";
import axios from "axios";

interface Props {
  disable: boolean;
  data: string;
  setData: (data: string) => void;
}

interface OptionProps {
  value: number;
  label: string;
}

const CountrySelector: React.FC<Props> = ({ disable, data, setData }) => {
  const [list, setList] = useState<OptionProps[] | null>(null);
  const [error, setError] = useState<string[] | null>(null);

  useEffect(() => {
    axios
      .get("/api/countries/?page_size=1000")
      .then((response) => {
        setList(
          response.data.results.map((_row) => ({
            label: _row.name,
            value: _row.id,
          })),
        );
      })
      .catch(function (error) {
        setError(error);
      });
  }, []);

  if (error) {
    return <Input disabled={true} value="Loading" color="red" width={"100%"} />;
  }
  if (!list) {
    return <Input disabled={true} value="Loading" width={"100%"} />;
  }
  return (
    <Select
      backgroundColor={"white"}
      disabled={disable}
      placeholder="Select country"
      width={"100%"}
      value={data}
      onChange={(e) => setData(e.target.value)}
    >
      {list.map((row) => (
        <option key={row.value} value={row.value}>
          {row.label}
        </option>
      ))}
    </Select>
  );
};

export default CountrySelector;
