import { Alert, Button, Heading, Modal } from '@navikt/ds-react'

interface Props {
  confirmButtonText: string
  cancelButtonText?: string
  disabled?: boolean
  confirmLoading?: boolean
  errorHeading?: string
  error?: string
  onConfirm: () => void
  onCancel?: () => void
}

export const ModalFooter = ({
  confirmButtonText,
  cancelButtonText,
  disabled,
  confirmLoading,
  errorHeading,
  error,
  onConfirm,
  onCancel
}: Props) => {
  return (
    <Modal.Footer className="flex-wrap flex-col">
      <div className="flex gap-4 items-center justify-start">
        <Button
          type="button"
          size="small"
          onClick={onConfirm}
          disabled={!!disabled}
          loading={confirmLoading}
        >
          {confirmButtonText}
        </Button>
        {cancelButtonText && onCancel && (
          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={onCancel}
            disabled={!!disabled}
          >
            {cancelButtonText}
          </Button>
        )}
      </div>
      {error && (
        <Alert
          size="small"
          variant="error"
          className="w-auto !ml-0 whitespace-pre-wrap"
          role="alert"
        >
          <Heading size="xsmall" level="2">
            {errorHeading ?? 'Kunne ikke lagre'}
          </Heading>
          {error}
        </Alert>
      )}
    </Modal.Footer>
  )
}
