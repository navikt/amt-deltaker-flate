import { Button, Modal } from '@navikt/ds-react'

interface Props {
  confirmButtonText: string
  cancelButtonText?: string
  disabled?: boolean
  confirmLoading?: boolean
  onConfirm: () => void
  onCancel?: () => void
}

export const ModalFooter = ({
  confirmButtonText,
  cancelButtonText,
  disabled,
  confirmLoading,
  onConfirm,
  onCancel
}: Props) => {
  return (
    <Modal.Footer className=" flex-wrap flex-row  ">
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
    </Modal.Footer>
  )
}
