import { Detail, HStack, Tag } from '@navikt/ds-react'
import {
  Vedtaksinformasjon,
  DeltakerStatus,
  DeltakerStatusAarsakType
} from '../model/deltaker'
import { formatDate, formatDateWithMonthName } from '../utils/utils'

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
        <Tag variant="info" size="small" className="mb-4">
          Utkastet er delt og venter på godkjenning
        </Tag>
      )}
      {vedtaksinformasjon &&
        (erEndret ? (
          <>
            <HStack gap="2" aria-atomic>
              <Detail as="span" weight="semibold" textColor={detailTextColor}>
                Første utkast delt:
              </Detail>
              <Detail as="span">
                {formatDateWithMonthName(vedtaksinformasjon.opprettet)}{' '}
                {vedtaksinformasjon.opprettetAv}
              </Detail>
            </HStack>
            {(!erEndretSammeDag || avbruttPgaGjennomforing) && (
              <HStack gap="2" className="mt-2" aria-atomic>
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
              </HStack>
            )}
          </>
        ) : (
          <HStack gap="2" aria-atomic>
            <Detail as="span" weight="semibold" textColor={detailTextColor}>
              Delt:
            </Detail>
            <Detail as="span">
              {formatDateWithMonthName(vedtaksinformasjon.opprettet)}{' '}
              {vedtaksinformasjon.opprettetAv}
            </Detail>
          </HStack>
        ))}
    </div>
  )
}
