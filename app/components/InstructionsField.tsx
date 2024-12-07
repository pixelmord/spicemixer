import { useFieldArray, Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import type { RecipeFormData } from "@/db/recipeSchema";

interface InstructionsFieldProps {
	control: Control<RecipeFormData>;
}

export function InstructionsField({ control }: InstructionsFieldProps) {
	const { fields, append, remove } = useFieldArray({
		control,
		name: "recipeInstructions",
	});

	return (
		<div className="space-y-4">
			<label className="text-sm font-medium">Instructions</label>
			{fields.map((field, index) => (
				<div key={field.id} className="space-y-2">
					<div className="flex items-center gap-2">
						<span className="font-medium">Step {index + 1}</span>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							onClick={() => remove(index)}
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
					<Textarea
						{...control.register(`recipeInstructions.${index}.text`)}
						placeholder="Enter instruction step..."
					/>
					<input
						type="hidden"
						{...control.register(`recipeInstructions.${index}.type`)}
						value="HowToStep"
					/>
					<input
						type="hidden"
						{...control.register(`recipeInstructions.${index}.position`)}
						value={index + 1}
					/>
				</div>
			))}
			<Button
				type="button"
				variant="outline"
				onClick={() =>
					append({ type: "HowToStep", text: "", position: fields.length + 1 })
				}
			>
				Add Step
			</Button>
		</div>
	);
}
