import { useFieldArray, Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import type { RecipeFormData } from "@/db/recipeSchema";

interface ArrayFieldProps {
	name: keyof RecipeFormData;
	control: Control<RecipeFormData>;
	label: string;
	placeholder?: string;
}

export function ArrayField({
	name,
	control,
	label,
	placeholder,
}: ArrayFieldProps) {
	const { fields, append, remove } = useFieldArray({
		control,
		name,
	});

	return (
		<div className="space-y-2">
			<label className="text-sm font-medium">{label}</label>
			{fields.map((field, index) => (
				<div key={field.id} className="flex gap-2">
					<Input
						{...control.register(`${name}.${index}` as any)}
						placeholder={placeholder}
					/>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={() => remove(index)}
					>
						<X className="h-4 w-4" />
					</Button>
				</div>
			))}
			<Button
				type="button"
				variant="outline"
				size="sm"
				onClick={() => append("")}
			>
				Add {label}
			</Button>
		</div>
	);
}
