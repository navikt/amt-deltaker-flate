import { InformationSquareIcon } from '@navikt/aksel-icons'
import {
  BodyShort,
  Checkbox,
  CheckboxGroup,
  InfoCard,
  InlineMessage,
  Label,
  Link,
  Radio,
  RadioGroup,
  Textarea
} from '@navikt/ds-react'
import {
  beregnEstimertTotalsum,
  getPrisInformasjonTekst,
  IngenKostnaderAarsak,
  NOK_FORMATTER,
  PrisinformasjonType,
  Tilskuddstype
} from 'deltaker-flate-common'
import { Controller, useFormContext } from 'react-hook-form'
import {
  NAVET_ANSKAFFELSE_URL,
  NAVET_EGENFINANSIERING_URL,
  NAVET_TILGJENGELIG_SKOLEPLASS_URL
} from '../../../constants'
import {
  FormPrisinformasjon,
  PameldingEnkeltplassFormValues,
  PRISINFO_MAX_TEGN
} from '../../../model/PameldingEnkeltplassFormValues'
import { NumberTextField } from '../../NumberTextField'
import { usePameldingFormContext } from '../PameldingFormContext'

export const PrisOgBetaling = () => {
  const { disabled } = usePameldingFormContext()
  const {
    control,
    setValue,
    watch,
    formState: { errors }
  } = useFormContext<PameldingEnkeltplassFormValues>()
  const valgtPrisType = watch('pristype')

  const renderPrisTypeInfo = () => {
    switch (valgtPrisType) {
      case PrisinformasjonType.Anskaffelse:
        return <Anskaffelse disabled={disabled} />
      case PrisinformasjonType.Tilskudd:
        return <Tilskudd disabled={disabled} />
      case PrisinformasjonType.IngenKostnader:
        return <IngenKostnader disabled={disabled} />
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <Controller
        name="pristype"
        control={control}
        render={({ field: { value, onChange, ref } }) => (
          <RadioGroup
            ref={ref}
            size="small"
            id="pristype"
            legend="Pris og betalingsbetingelser"
            description="Navs kostnader for opplæringen"
            disabled={disabled}
            error={errors.pristype?.message}
            value={value}
            onChange={(nextValue) => {
              onChange(nextValue)
              setValue('prisinformasjon', null)
            }}
          >
            <Radio
              value={PrisinformasjonType.Anskaffelse}
              description="Nav har avtalt å betale leverandøren direkte"
            >
              Anskaffelse er gjort
            </Radio>
            <Radio
              value={PrisinformasjonType.Tilskudd}
              description="Utbetales basert på dokumenterte utgifter"
            >
              Tilskudd til en tilgjengelig studie- eller skoleplass
            </Radio>
            <Radio
              value={PrisinformasjonType.IngenKostnader}
              description="Ikke aktuelt med betaling eller refusjon fra Nav"
            >
              Ingen kostnader
            </Radio>
          </RadioGroup>
        )}
      />

      {renderPrisTypeInfo()}
    </div>
  )
}

const Anskaffelse = ({ disabled }: { disabled: boolean }) => {
  const {
    control,
    formState: { errors },
    clearErrors
  } = useFormContext<PameldingEnkeltplassFormValues>()

  return (
    <>
      <InlineMessage status="info" size="small">
        Husk å følge{' '}
        <Link href={NAVET_ANSKAFFELSE_URL}>
          rutinen for anskaffelse av enkeltplasser på Navet.
        </Link>
      </InlineMessage>

      <Controller
        name="prisinformasjon"
        control={control}
        render={({ field: { value, onChange, ref } }) => (
          <NumberTextField
            ref={ref}
            label="Totalbeløp for anskaffelsen:"
            description="Beløpet må oppgis i hele norske kroner"
            value={
              value?.type === PrisinformasjonType.Anskaffelse
                ? (value.pris ?? undefined)
                : undefined
            }
            onChange={(newValue) => {
              onChange({
                type: PrisinformasjonType.Anskaffelse,
                pris: newValue
              })
              if (newValue && newValue > 0) {
                clearErrors('prisinformasjon_anskaffelse-totalbelop')
              }
            }}
            error={errors['prisinformasjon_anskaffelse-totalbelop']?.message}
            disabled={disabled}
            required
            id="anskaffelse-totalbelop"
            className="[&>input]:w-32"
          />
        )}
      />

      <PrisInfoCard />
    </>
  )
}

const Tilskudd = ({ disabled }: { disabled: boolean }) => {
  const {
    clearErrors,
    setValue,
    watch,
    formState: { errors }
  } = useFormContext<PameldingEnkeltplassFormValues>()
  const prisinformasjon = watch('prisinformasjon')
  const tilleggsopplysninger = getTilleggstekst(prisinformasjon)

  const estimertTotalsum = beregnEstimertTotalsum(prisinformasjon)
  const valgteTilskudd = erTilskudd(prisinformasjon)
    ? prisinformasjon.tilskudd
    : []

  return (
    <>
      <div>
        <InlineMessage status="info" size="small">
          Husk at tilskudd bare kan gis når opplæringen er en{' '}
          <Link href={NAVET_TILGJENGELIG_SKOLEPLASS_URL}>
            tilgjengelig studie- eller skoleplass.
          </Link>
        </InlineMessage>
        <InlineMessage status="info" size="small" className="mt-2">
          Tilskuddene utbetales ikke automatisk. Brukeren betaler som regel selv
          og kan senere søke Nav om refusjon. For at refusjon skal være mulig,
          må du først registrere aktuelle tilskudd her.
        </InlineMessage>
      </div>

      <CheckboxGroup
        legend="Velg hvilke tilskudd som er aktuelle og anslå beløp"
        description="Ved flere semester skal du oppgi den estimerte totalsummen"
        disabled={disabled}
        size="small"
        id="tilskuddstype-checkbox"
        error={errors['prisinformasjon_tilskuddstype-checkbox']?.message}
        onChange={(nyeValgteTilskudd: Tilskuddstype[]) => {
          setValue('prisinformasjon', {
            type: PrisinformasjonType.Tilskudd,
            tilskudd: nyeValgteTilskudd.map((tilskudd) => ({
              tilskudd,
              belop:
                valgteTilskudd.find((t) => t.tilskudd === tilskudd)?.belop ?? 0
            })),
            tilleggsopplysninger
          })

          if (nyeValgteTilskudd.length > 0) {
            clearErrors('prisinformasjon_tilskuddstype-checkbox')
          }
        }}
        value={valgteTilskudd.map((t) => t.tilskudd)}
      >
        {Object.values(Tilskuddstype).map((tilskuddstype) => (
          <div key={tilskuddstype}>
            <Checkbox value={tilskuddstype}>
              {getPrisInformasjonTekst(tilskuddstype)}
            </Checkbox>

            {valgteTilskudd.map((t) => t.tilskudd).includes(tilskuddstype) && (
              <NumberTextField
                id={`pris-${tilskuddstype}`}
                label="Estimert totalbeløp"
                inlineLabel
                value={
                  valgteTilskudd.find((t) => t.tilskudd === tilskuddstype)
                    ?.belop
                }
                onChange={(nyttBelop) => {
                  setValue('prisinformasjon', {
                    type: PrisinformasjonType.Tilskudd,
                    tilskudd: valgteTilskudd.map((t) =>
                      t.tilskudd === tilskuddstype
                        ? { ...t, belop: nyttBelop ?? 0 }
                        : t
                    ),
                    tilleggsopplysninger: tilleggsopplysninger ?? null
                  })

                  if (nyttBelop && nyttBelop > 0) {
                    clearErrors(`prisinformasjon_pris-${tilskuddstype}`)
                  }
                }}
                error={errors[`prisinformasjon_pris-${tilskuddstype}`]?.message}
                disabled={disabled}
                required
                className="[&>input]:w-32"
                containerClassName="ml-6 mt-2"
              />
            )}
          </div>
        ))}
      </CheckboxGroup>

      <Label size="small">
        Estimert totalsum: {NOK_FORMATTER.format(estimertTotalsum)} kr
      </Label>

      <InlineMessage status="info" size="small">
        Hvis brukeren kun skal ha <b>tiltakspenger</b> eller{' '}
        <b>tilleggsstønader</b>, må du velge «ingen kostnader». Brukeren må i
        tillegg sende en egen søknad om disse ytelsene.
      </InlineMessage>

      <Tilleggsopplysninger
        disabled={disabled}
        type={PrisinformasjonType.Tilskudd}
      />

      <PrisInfoCard />
    </>
  )
}

const IngenKostnader = ({ disabled }: { disabled: boolean }) => {
  const {
    control,
    clearErrors,
    watch,
    formState: { errors }
  } = useFormContext<PameldingEnkeltplassFormValues>()
  const prisinformasjon = watch('prisinformasjon')
  const valgtAarsak = hentValgtAarsak(prisinformasjon)
  const visEgenfinansiering =
    valgtAarsak === IngenKostnaderAarsak.OPPLAERINGEN_ER_EGENFINANSIERT

  return (
    <>
      <Controller
        name="prisinformasjon"
        control={control}
        render={({ field: { value, onChange, ref } }) => {
          return (
            <RadioGroup
              ref={ref}
              size="small"
              id="ingen-kostnader-aarsak"
              legend="Årsaken til at det ikke er aktuelt med betaling eller refusjon fra Nav"
              disabled={disabled}
              error={errors['prisinformasjon_ingen-kostnader-aarsak']?.message}
              value={valgtAarsak}
              onChange={(nextValue: IngenKostnaderAarsak) => {
                onChange(
                  getOppdatertIngenKostnader(
                    nextValue,
                    erIngenKostnader(value) ? value.tilleggsopplysninger : null
                  )
                )
                if (nextValue) {
                  clearErrors('prisinformasjon_ingen-kostnader-aarsak')
                }
              }}
            >
              <Radio value={IngenKostnaderAarsak.OPPLAERINGEN_ER_KOSTNADSFRI}>
                Opplæringen er kostnadsfri
              </Radio>
              <Radio
                value={IngenKostnaderAarsak.OPPLAERINGEN_ER_EGENFINANSIERT}
              >
                Bruker dekker opplæringen fullt ut selv
              </Radio>
            </RadioGroup>
          )
        }}
      />

      {visEgenfinansiering && (
        <>
          <InlineMessage status="info" size="small">
            Husk å først inngå en skriftlig avtale med bruker om
            egenfinansiering.
            <Link href={NAVET_EGENFINANSIERING_URL}>
              Les mer på Navet om del- og egenfinansiering.
            </Link>
          </InlineMessage>

          <Tilleggsopplysninger
            disabled={disabled}
            required
            type={PrisinformasjonType.IngenKostnader}
          />
        </>
      )}

      <InlineMessage status="info" size="small">
        Husk at hvis Nav skal gi tiltakspenger eller tilleggsstønader så må
        brukeren sende egen søknad om dette.
      </InlineMessage>

      <PrisInfoCard />
    </>
  )
}

const Tilleggsopplysninger = ({
  disabled,
  required = false,
  type
}: {
  disabled: boolean
  required?: boolean
  type: PrisinformasjonType.Tilskudd | PrisinformasjonType.IngenKostnader
}) => {
  const {
    watch,
    setValue,
    clearErrors,
    formState: { errors }
  } = useFormContext<PameldingEnkeltplassFormValues>()
  const prisinformasjon = watch('prisinformasjon')
  const tilleggsopplysninger =
    prisinformasjon?.type === type
      ? (prisinformasjon.tilleggsopplysninger ?? '')
      : ''
  const textAreaId =
    type === PrisinformasjonType.Tilskudd
      ? 'tilleggsopplysninger-tilskudd'
      : 'tilleggsopplysninger-ingen-kostnader'

  return (
    <Textarea
      id={textAreaId}
      label={`Tilleggsopplysninger om kostnader${required ? '' : ' (valgfritt)'}`}
      description="For eksempel om brukeren skal dekke deler av kostnadene selv"
      size="small"
      aria-required={required}
      error={errors[`prisinformasjon_${textAreaId}`]?.message}
      disabled={disabled}
      maxLength={PRISINFO_MAX_TEGN}
      value={tilleggsopplysninger}
      onChange={(e) => {
        if (type === PrisinformasjonType.Tilskudd) {
          setValue('prisinformasjon', {
            type: PrisinformasjonType.Tilskudd,
            tilskudd: erTilskudd(prisinformasjon)
              ? prisinformasjon.tilskudd
              : [],
            tilleggsopplysninger: e.target.value
          })
          return
        }

        setValue('prisinformasjon', {
          type: PrisinformasjonType.IngenKostnader,
          aarsak: erIngenKostnader(prisinformasjon)
            ? prisinformasjon.aarsak
            : IngenKostnaderAarsak.OPPLAERINGEN_ER_KOSTNADSFRI,
          tilleggsopplysninger: e.target.value
        })

        if (e.target.value) {
          clearErrors(`prisinformasjon_${textAreaId}`)
        }
      }}
    />
  )
}

const PrisInfoCard = () => {
  return (
    <InfoCard size="small">
      <InfoCard.Header icon={<InformationSquareIcon aria-hidden />}>
        <InfoCard.Title>
          Pris og betalingsbetingelser sendes til godkjenning
        </InfoCard.Title>
      </InfoCard.Header>

      <InfoCard.Content>
        <BodyShort size="small">
          Når pris og betalingsbetingelser er godkjent, fattes vedtaket og
          brukeren får beskjed.
        </BodyShort>
      </InfoCard.Content>
    </InfoCard>
  )
}

const erTilskudd = (prisinformasjon: FormPrisinformasjon) =>
  prisinformasjon?.type === PrisinformasjonType.Tilskudd

const erIngenKostnader = (prisinformasjon: FormPrisinformasjon) =>
  prisinformasjon?.type === PrisinformasjonType.IngenKostnader

const getTilleggstekst = (prisinformasjon: FormPrisinformasjon) =>
  erTilskudd(prisinformasjon) || erIngenKostnader(prisinformasjon)
    ? (prisinformasjon.tilleggsopplysninger ?? null)
    : null

const hentValgtAarsak = (prisinformasjon: FormPrisinformasjon) =>
  erIngenKostnader(prisinformasjon) ? prisinformasjon.aarsak : null

const getOppdatertIngenKostnader = (
  nextValue: IngenKostnaderAarsak,
  currentTilleggsopplysninger: string | null | undefined
) => ({
  type: PrisinformasjonType.IngenKostnader,
  aarsak: nextValue,
  tilleggsopplysninger: currentTilleggsopplysninger ?? null
})
