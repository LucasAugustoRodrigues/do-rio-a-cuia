import { ComponentPropsWithoutRef } from "react";

type TextFieldProps = {
  rotulo: string;
  name: string;
  erro?: boolean;
} & Omit<ComponentPropsWithoutRef<"input">, "name">;

export default function TextField({ rotulo, name, erro, ...props }: TextFieldProps) {
  const id = "campo-" + name;
  return (
    <div>
      <label htmlFor={id} className="block text-[15px] font-medium leading-6 text-roxo-900">
        {rotulo}
      </label>
      <input
        id={id}
        name={name}
        aria-invalid={erro || undefined}
        className="mt-1.5 h-[52px] w-full rounded-[16px] border-[1.5px] border-bege-borda bg-branco px-4 text-[16px] text-roxo-900 placeholder:text-roxo-texto-2 aria-[invalid=true]:border-vermelho"
        {...props}
      />
    </div>
  );
}
