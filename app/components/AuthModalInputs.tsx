import React from "react";

interface Props {
  inputs: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city: string;
    password: string;
  };
  handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSignIn: boolean;
}

export default function AuthModalInputs({
  inputs,
  handleInput,
  isSignIn,
}: Props) {
  return (
    <>
      {isSignIn ? null : (
        <div className="my-3 flex justify-between text-sm">
          <input
            type="text"
            className="border border-zinc-400 rounded p-2 py-3 w-[49%]"
            placeholder="First name"
            value={inputs.firstName}
            name="firstName"
            onChange={handleInput}
          />
          <input
            type="text"
            className="border border-zinc-400 rounded p-2 py-3 w-[49%]"
            placeholder="Last name"
            value={inputs.lastName}
            name="lastName"
            onChange={handleInput}
          />
        </div>
      )}
      <div className="my-3 text-sm">
        <input
          type="text"
          className="border border-zinc-400 rounded p-2 py-3 w-full"
          placeholder="Email"
          value={inputs.email}
          name="email"
          onChange={handleInput}
        />
      </div>
      {isSignIn ? null : (
        <div className="my-3 flex justify-between text-sm">
          <input
            type="text"
            className="border border-zinc-400 rounded p-2 py-3 w-[49%]"
            placeholder="Phone"
            value={inputs.phone}
            name="phone"
            onChange={handleInput}
          />
          <input
            type="text"
            className="border border-zinc-400 rounded p-2 py-3 w-[49%]"
            placeholder="City"
            value={inputs.city}
            name="city"
            onChange={handleInput}
          />
        </div>
      )}
      <div className="my-3 text-sm">
        <input
          type="password"
          className="border border-zinc-400 rounded p-2 py-3 w-full"
          placeholder="Password"
          value={inputs.password}
          name="password"
          onChange={handleInput}
        />
      </div>
    </>
  );
}
