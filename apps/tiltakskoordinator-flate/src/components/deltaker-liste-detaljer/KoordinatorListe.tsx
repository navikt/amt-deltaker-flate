import { PersonIcon, TrashIcon } from '@navikt/aksel-icons'
import {
  Alert,
  BodyShort,
  Button,
  List,
  Modal,
  ReadMore
} from '@navikt/ds-react'
import { DeferredFetchState, useDeferredFetch } from 'deltaker-flate-common'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fjernTilgang } from '../../api/api.ts'
import { Koordinator } from '../../api/data/deltakerliste.ts'
import { getIkkeTilgangTilDeltakerlisteUrl } from '../../navigation.ts'
import { isEnvLocalDemoOrPr } from '../../utils/environment-utils.ts'
import { gaTilGjennomforingerMulighetsrommet } from '../../utils/utils.ts'

export const KoordinatorListe = ({
  deltakerlisteId,
  koordinatorer
}: {
  deltakerlisteId: string
  koordinatorer: Koordinator[]
}) => {
  const [visFjernKoordinatorModal, setVisFjernKoordinatorModal] =
    useState(false)
  const navigate = useNavigate()
  const {
    error,
    state,
    doFetch: postFjernTilgang
  } = useDeferredFetch(fjernTilgang)

  const fjernKoordinator = () => {
    postFjernTilgang(deltakerlisteId)
      .then(() => setVisFjernKoordinatorModal(false))
      .then(() => {
        if (isEnvLocalDemoOrPr) {
          navigate(getIkkeTilgangTilDeltakerlisteUrl(deltakerlisteId))
        } else {
          gaTilGjennomforingerMulighetsrommet()
        }
      })
  }

  const tidligereKoordinatorer = koordinatorer.filter(
    (koordinator) => !koordinator.erAktiv
  )

  const aktiveKoordinatorer = koordinatorer.filter(
    (koordinator) => koordinator.erAktiv
  )

  return (
    <>
      <List as="ul" size="small">
        {aktiveKoordinatorer.map((koordinator) => (
          <List.Item key={koordinator.id} icon={<PersonIcon aria-hidden />}>
            <div className="flex gap-1 items-center">
              <BodyShort size="small">{koordinator.navn}</BodyShort>
              {koordinator.kanFjernes && (
                <Button
                  variant="tertiary"
                  size="xsmall"
                  icon={<TrashIcon title="Fjern meg selv som koordinator" />}
                  onClick={() => setVisFjernKoordinatorModal(true)}
                />
              )}
            </div>
          </List.Item>
        ))}
      </List>

      <ReadMore size="small" header="Tidligere koordinatorer">
        {tidligereKoordinatorer.length > 0 ? (
          <List as="ul" size="small">
            {tidligereKoordinatorer.map((koordinator) => (
              <List.Item key={koordinator.id} icon={<PersonIcon aria-hidden />}>
                <BodyShort size="small">{koordinator.navn}</BodyShort>
              </List.Item>
            ))}
          </List>
        ) : (
          <BodyShort size="small">Her var det tomt gitt</BodyShort>
        )}
      </ReadMore>

      <Modal
        open={visFjernKoordinatorModal}
        onClose={() => setVisFjernKoordinatorModal(false)}
        header={{ heading: 'Fjern min tilgang som koordinator' }}
      >
        <Modal.Body>
          <BodyShort>
            Tiltaket fjernes fra listen over dine gjennomføringer.
          </BodyShort>
          <BodyShort className="pt-8 max-w-[40ch]">
            {
              'Navnet ditt vil vises ved deltakerlisten under "Tidligere koordinatorer".'
            }
          </BodyShort>

          {error && (
            <Alert size="small" variant="error">
              Kunne ikke fjerne tilgang for koordinator. Prøv igjen senere.
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            size="small"
            onClick={fjernKoordinator}
            loading={state === DeferredFetchState.LOADING}
          >
            Fjern min tilgang
          </Button>
          <Button
            size="small"
            variant="tertiary"
            loading={state === DeferredFetchState.LOADING}
            onClick={() => setVisFjernKoordinatorModal(false)}
          >
            Avbryt
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
