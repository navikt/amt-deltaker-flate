import { Detail, Tag } from '@navikt/ds-react'
import {
  DeltakerStatus,
  DeltakerStatusAarsakType,
  Vedtaksinformasjon
} from '../model/deltaker'
import { formatDate, formatDateWithMonthName } from '../utils/utils'
import { ACTION_BLUE_TAG_STYLE } from '../utils/forslagUtils'

interface Props {
  vedtaksinformasjon: Vedtaksinformasjon | null
  deltakerStatus: DeltakerStatus
  visStatusVenterPaaBruker?: boolean
  erNAVVeileder?: boolean
}

export const UtkastHeader = ({
  vedtaksinformasjon,
  deltakerStatus,
  visStatusVenterPaaBruker,
  erNAVVeileder
}: Props) => {
  const avbruttPgaGjennomforing =
    deltakerStatus.aarsak?.type ===
    DeltakerStatusAarsakType.SAMARBEIDET_MED_ARRANGOREN_ER_AVBRUTT
  const erEndret =
    vedtaksinformasjon?.sistEndret !== vedtaksinformasjon?.opprettet ||
    vedtaksinformasjon?.sistEndretAv !== vedtaksinformasjon?.opprettetAv

  const erEndretSammeDag =
    erEndret &&
    formatDate(vedtaksinformasjon?.sistEndret) ===
      formatDate(vedtaksinformasjon?.opprettet)

  const detailTextColor = erNAVVeileder ? 'subtle' : 'default'

  return (
    <div className="mt-4 mb-4">
      {visStatusVenterPaaBruker && (
        <Tag
          variant="outline"
          data-color="info"
          size="small"
          className={`mb-4 ${ACTION_BLUE_TAG_STYLE}`}
        >
          Utkastet er delt og venter på godkjenning
        </Tag>
      )}
      {vedtaksinformasjon &&
        (erEndret ? (
          <>
            <div className="flex gap-2" aria-atomic>
              <Detail as="span" weight="semibold" textColor={detailTextColor}>
                Første utkast delt:
              </Detail>
              <Detail as="span">
                {formatDateWithMonthName(vedtaksinformasjon.opprettet)}{' '}
                {vedtaksinformasjon.opprettetAv}
              </Detail>
            </div>
            {(!erEndretSammeDag || avbruttPgaGjennomforing) && (
              <div className="flex gap-2 mt-2" aria-atomic>
                <Detail as="span" weight="semibold" textColor={detailTextColor}>
                  Sist endret:
                </Detail>
                {avbruttPgaGjennomforing ? (
                  <Detail as="span">
                    {formatDateWithMonthName(deltakerStatus.gyldigFra)} -
                    Samarbeidet med arrangøren er avsluttet
                  </Detail>
                ) : (
                  <Detail as="span">
                    {formatDateWithMonthName(vedtaksinformasjon.sistEndret)}{' '}
                    {vedtaksinformasjon.sistEndretAv}
                  </Detail>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex gap-2" aria-atomic>
            <Detail as="span" weight="semibold" textColor={detailTextColor}>
              Delt:
            </Detail>
            <Detail as="span">
              {formatDateWithMonthName(vedtaksinformasjon.opprettet)}{' '}
              {vedtaksinformasjon.opprettetAv}
            </Detail>
          </div>
        ))}
    </div>
  )
}
