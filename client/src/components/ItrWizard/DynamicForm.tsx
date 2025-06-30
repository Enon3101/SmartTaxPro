import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FormField as IFormField, IncomeSourceFields } from '@/utils/compulsoryFieldsLoader';

interface DynamicFormProps {
  sourceCode: string;
  fields: IncomeSourceFields;
  onSubmit: (data: any) => void;
  title?: string;
  description?: string;
}

export function DynamicForm({
  sourceCode,
  fields,
  onSubmit,
  title,
  description
}: DynamicFormProps) {
  const [schema, setSchema] = useState<z.ZodObject<any>>();
  const [defaultValues, setDefaultValues] = useState<Record<string, any>>({});

  // Create Zod schema and default values from fields
  useEffect(() => {
    const schemaMap: Record<string, any> = {};
    const defaultsMap: Record<string, any> = {};

    // Process each field and build the schema
    fields.fields.forEach((field) => {
      let fieldSchema: any = z.any();

      // Define schema based on field type and validation
      switch (field.type) {
        case 'text':
        case 'textarea':
          fieldSchema = z.string();
          if (field.validation?.minLength) {
            fieldSchema = fieldSchema.min(field.validation.minLength, 
              `${field.label} must be at least ${field.validation.minLength} characters`);
          }
          defaultsMap[field.id] = '';
          break;

        case 'number':
          fieldSchema = z.string().refine((val: string) => !isNaN(Number(val)), {
            message: `${field.label} must be a valid number`
          });
          if (field.validation?.min !== undefined) {
            fieldSchema = fieldSchema.refine((val: string) => Number(val) >= field.validation!.min!, {
              message: `${field.label} must be at least ${field.validation!.min}`
            });
          }
          defaultsMap[field.id] = '';
          break;

        case 'date':
          fieldSchema = z.string();
          defaultsMap[field.id] = '';
          break;

        case 'select':
          fieldSchema = z.string();
          defaultsMap[field.id] = field.options && field.options.length > 0 
            ? field.options[0].value 
            : '';
          break;

        default:
          fieldSchema = z.any();
          defaultsMap[field.id] = '';
      }

      // Add required validation
      if (field.validation?.required) {
        fieldSchema = fieldSchema.min(1, `${field.label} is required`);
      } else {
        fieldSchema = fieldSchema.optional();
      }

      schemaMap[field.id] = fieldSchema;
    });

    setSchema(z.object(schemaMap));
    setDefaultValues(defaultsMap);
  }, [fields]);

  const form = useForm<z.infer<any>>({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: defaultValues,
  });

  const handleSubmit = (data: any) => {
    onSubmit({ ...data, sourceCode });
  };

  // Only render form if schema is ready
  if (!schema) {
    return <div>Loading form...</div>;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title || `${sourceCode} Details`}</CardTitle>
        <CardDescription>
          {description || fields.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {fields.fields.map((field) => {
              // Check if field should be shown based on conditions
              if (field.showWhen) {
                const dependentValue = form.watch(field.showWhen.field);
                if (!field.showWhen.equals.includes(dependentValue)) {
                  return null;
                }
              }

              return (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={field.id}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>{field.label}</FormLabel>
                      <FormControl>
                        {renderFormControl(field, formField)}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            })}
            
            <Button type="submit" className="w-full">
              Save
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// Helper function to render the appropriate form control based on field type
function renderFormControl(field: IFormField, formField: any) {
  switch (field.type) {
    case 'textarea':
      return (
        <Textarea
          placeholder={field.label}
          {...formField}
        />
      );
      
    case 'select':
      return (
        <Select 
          onValueChange={formField.onChange} 
          defaultValue={formField.value}
        >
          <SelectTrigger>
            <SelectValue placeholder={`Select ${field.label}`} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
      
    case 'date':
      return (
        <Input
          type="date"
          {...formField}
        />
      );
      
    case 'number':
      return (
        <Input
          type="number"
          placeholder="0"
          {...formField}
        />
      );
      
    default:
      return (
        <Input
          placeholder={field.label}
          {...formField}
        />
      );
  }
}