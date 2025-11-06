
import React from 'react';

interface DateTimePickerProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id: string;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({ label, value, onChange, id }) => {
  return (
    <div className="flex flex-col space-y-2 flex-grow">
      <label htmlFor={id} className="text-sm font-medium text-gray-400">
        {label}
      </label>
      <input
        id={id}
        type="datetime-local"
        value={value}
        onChange={onChange}
        className="bg-gray-800 border border-gray-600 text-gray-200 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
      />
    </div>
  );
};

export default DateTimePicker;
