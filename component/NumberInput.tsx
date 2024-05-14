import { Input } from "@nextui-org/react";
import { ChangeEvent, useState } from "react";

interface Props {
  value: number;
  onChangeValue: (value: number) => void;
}

const NumberInput = ({ value, onChangeValue }: Props) => {
  const [inputValue, setInputValue] = useState<string>(
    value.toLocaleString("en-US")
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    // Remove commas from the input value
    const sanitizedValue = rawValue.replace(/,/g, "");
    setInputValue(formatNumberWithCommas(sanitizedValue));
    onChangeValue(parseInt(sanitizedValue));
  };

  const formatNumberWithCommas = (value: string) => {
    const number = parseInt(value);
    if (!isNaN(number)) {
      return number.toLocaleString("en-US"); // Format with commas
    } else {
      return value; // If the input is not a valid number, return as is
    }
  };

  return (
    <Input
      type="text"
      value={inputValue}
      onChange={handleInputChange}
      placeholder="Enter a number"
    />
  );
};

export default NumberInput;
