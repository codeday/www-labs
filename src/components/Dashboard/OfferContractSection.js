import Form from '../RsjForm';

export default function OfferContractSection({ schema, uiSchema, formData, onDataChange, onErrorsChange }) {
  if (!schema) return null;
  return (
    <Form
      schema={schema}
      uiSchema={uiSchema}
      onChange={(e) => { onDataChange(e.formData); onErrorsChange(e.errors); }}
      formData={formData}
      children={true}
      showErrorList={false}
      liveValidate
    />
  );
}
