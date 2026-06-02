import { Tiltakskode } from 'deltaker-flate-common'
import {
  FlattKodeverk,
  KodeverkAlternativType,
  OpplaringRepresenterer,
  KodeverkResponse,
  KodeverkSertifiseringResponse,
  Seleksjonstype,
  VerdigruppeSokKilde
} from '../api/data/kodeverk'

export const createMockFlatKodeverk = (
  tiltakskode: Tiltakskode
): FlattKodeverk => {
  return {
    tiltakskode: tiltakskode,
    tittel: 'Butikk- og salgsarbeid',
    valg: ['B - Personbil', 'C - Lastebil'],
    valgteKodeverkIder: [
      '14886bad-a495-420a-9bae-d33e2d88041a',
      '79d1a970-e8f0-4ecd-8d5e-e7c8d5f3394c'
    ],
    valgteSertifiseringer: [{ id: 3, navn: 'Sertifisert zumba-instruktør' }]
  }
}

export const createMockKodeverkResponse = (
  tiltakskode: Tiltakskode
): KodeverkResponse => {
  return (
    mockKodeverk.find((kodeverk) => kodeverk.tiltakskode === tiltakskode) ?? {
      tiltakskode,
      alternativer: [],
      sertifiseringValg: []
    }
  )
}

const mockKodeverk: KodeverkResponse[] = [
  {
    tiltakskode: Tiltakskode.ARBEIDSMARKEDSOPPLAERING,
    alternativer: [
      {
        type: KodeverkAlternativType.VERDIGRUPPE,
        id: null,
        visningsnavn: 'Bransje',
        pakrevd: true,
        representerer: OpplaringRepresenterer.BRANSJE_ID,
        seleksjonstype: Seleksjonstype.ENKELTVALG,
        alternativer: [
          {
            id: '14886bad-a495-420a-9bae-d33e2d88041a',
            visningsnavn: 'Barne- og ungdomsarbeid',
            valgt: false
          },
          {
            id: 'e6749d6c-aacf-452d-baf2-d5fb5021912b',
            visningsnavn: 'Butikk- og salgsarbeid',
            valgt: false
          },
          {
            id: 'd9b1c8e0-1c3a-4f5b-9c2e-1a2b3c4d5e6f',
            visningsnavn: 'Bygg og anlegg',
            valgt: false
          },
          {
            id: '82bd7ce0-70f1-448b-8773-9015dea613e7',
            visningsnavn: 'Helse, pleie og omsorg',
            valgt: false
          },
          {
            id: '4733d7ef-d106-47a4-b335-bfd132c8ad31',
            visningsnavn: 'Industriarbeid',
            valgt: false
          },
          {
            id: 'd04dff0d-fdca-4839-9bdc-44c722af5d6f',
            visningsnavn: 'Ingeniør- og IKT-fag',
            valgt: false
          },
          {
            id: 'a86c1f7a-47c3-4f69-b138-89341107e0eb',
            visningsnavn: 'Kontorarbeid',
            valgt: false
          },
          {
            id: 'c8851a31-6362-4ee2-8989-e5da95726076',
            visningsnavn: 'Reiseliv, servering og transport',
            valgt: false
          },
          {
            id: '47c9d5f0-66ea-4e68-949d-86733346ee80',
            visningsnavn: 'Serviceyrker og annet arbeid',
            valgt: false
          },
          {
            id: '54ccb278-92ea-4835-8566-659e98602905',
            visningsnavn: 'Andre bransjer',
            valgt: false
          }
        ]
      },
      {
        type: KodeverkAlternativType.VERDIGRUPPE,
        id: null,
        visningsnavn: 'Førerkort',
        pakrevd: false,
        representerer: OpplaringRepresenterer.FORERKORT,
        seleksjonstype: Seleksjonstype.FLERVALG,
        alternativer: [
          {
            id: 'c67006e4-2629-4993-a047-92f31b0db557',
            visningsnavn: 'A1 - Lett motorsykkel',
            valgt: false
          },
          {
            id: 'ed44bd3a-aedb-4225-a3d8-c8f1b95fec5a',
            visningsnavn: 'A2 - Mellomtung motorsykkel',
            valgt: false
          },
          {
            id: 'ee66eb0b-d4a8-4527-800a-135dd3c0d422',
            visningsnavn: 'AM 147 - Mopedbil',
            valgt: false
          },
          {
            id: 'dee7d6b8-02dc-4b7e-bb3a-fa71cc9248e3',
            visningsnavn: 'AM - Moped',
            valgt: false
          },
          {
            id: '810fe1c6-56b0-4e00-8ae6-00fb574299e5',
            visningsnavn: 'A - Motorsykkel',
            valgt: false
          },
          {
            id: '84a40884-421c-406c-994d-4c4c15ef8bcc',
            visningsnavn: 'B 78 - Personbil med automatgir',
            valgt: false
          },
          {
            id: 'cdbebefc-2cec-48d0-9c8e-bd464e56cfaa',
            visningsnavn: 'BE - Personbil med tilhenger',
            valgt: false
          },
          {
            id: '79d1a970-e8f0-4ecd-8d5e-e7c8d5f3394c',
            visningsnavn: 'B - Personbil',
            valgt: false
          },
          {
            id: '69f88a08-e2de-461f-9258-4f8be546104a',
            visningsnavn: 'C1E - Lett lastebil med tilhenger',
            valgt: false
          },
          {
            id: 'c65936e4-479f-4c84-b106-6c9ec0cf9aee',
            visningsnavn: 'C1 - Lett lastebil',
            valgt: false
          },
          {
            id: '9a85cdeb-2f6d-44f6-bef2-2add850f7b27',
            visningsnavn: 'CE - Lastebil med tilhenger',
            valgt: false
          },
          {
            id: 'e3fcf1f7-1f20-4fca-bad5-422b7ee0418f',
            visningsnavn: 'C - Lastebil',
            valgt: false
          },
          {
            id: '34d00562-f382-4027-953d-2b6f6bb7e0e5',
            visningsnavn: 'D1E - Minibuss med tilhenger',
            valgt: false
          },
          {
            id: '5d890e23-6800-4574-a05d-24ca81f35a2a',
            visningsnavn: 'D1 - Minibuss',
            valgt: false
          },
          {
            id: 'e637320c-a5f0-4f7d-ad44-0a7c4654b4c2',
            visningsnavn: 'D - Buss',
            valgt: false
          },
          {
            id: 'a7376d16-b0da-4140-8e67-c589be2c0ea2',
            visningsnavn: 'DE - Buss med tilhenger',
            valgt: false
          },
          {
            id: '5b1e1732-a5e8-45ca-955f-548c65d11065',
            visningsnavn: 'S - Snøscooter',
            valgt: false
          },
          {
            id: '53896c05-7650-48ed-bf23-54ae78794eba',
            visningsnavn: 'T - Traktor',
            valgt: false
          }
        ]
      },
      {
        type: KodeverkAlternativType.VERDIGRUPPE_SOK,
        id: null,
        pakrevd: false,
        visningsnavn: 'Sertifiseringer',
        representerer: OpplaringRepresenterer.SERTIFISERINGER,
        seleksjonstype: Seleksjonstype.FLERVALG,
        kilde: VerdigruppeSokKilde.JANZZ_SERTIFISERING
      }
    ],
    sertifiseringValg: []
  },
  {
    tiltakskode: Tiltakskode.FAG_OG_YRKESOPPLAERING,
    alternativer: [
      {
        type: KodeverkAlternativType.UTDANNING_GRUPPE,
        id: null,
        visningsnavn: 'Utdanningsprogram',
        representerer: OpplaringRepresenterer.UTDANNINGSPROGRAM_ID,
        pakrevd: true,
        utdanninger: [
          {
            id: '1390a963-e9b2-4677-bb87-243f4638b7a1',
            visningsnavn: 'Bygg- og anleggsteknikk',
            larefag: {
              id: null,
              visningsnavn: 'Lærefag',
              pakrevd: true,
              representerer: OpplaringRepresenterer.LAREFAG,
              seleksjonstype: Seleksjonstype.FLERVALG,
              alternativer: [
                {
                  id: '4248ce0c-ddea-4eec-8eba-5c9c33d2af66',
                  visningsnavn: 'Anleggsgartnerfaget',
                  valgt: false
                },
                {
                  id: '06fc4d55-da62-48fc-b8da-0e7bdb5936f2',
                  visningsnavn: 'Anleggsmaskinførerfaget',
                  valgt: false
                },
                {
                  id: '319eb6c4-f1a3-404f-ae61-a1240841ad90',
                  visningsnavn: 'Anleggsrørleggerfaget',
                  valgt: false
                },
                {
                  id: '03487a05-37af-496a-bc07-92d7b200b7de',
                  visningsnavn: 'Asfaltfaget',
                  valgt: false
                },
                {
                  id: 'd02ffbea-7f0e-42ff-91a0-88d56277699d',
                  visningsnavn: 'Banemontørfaget',
                  valgt: false
                },
                {
                  id: '17fb8c5e-7a94-48b6-a00b-eeb442860af6',
                  visningsnavn: 'Betongfaget',
                  valgt: false
                },
                {
                  id: '6507d18b-b225-4989-9f90-e5a70b9683fa',
                  visningsnavn: 'Brannforebyggerfaget',
                  valgt: false
                },
                {
                  id: '06ecb66d-6173-4664-b58a-83be6e3c5373',
                  visningsnavn: 'Brønn- og borefaget',
                  valgt: false
                },
                {
                  id: '32fff4d1-ef8f-4990-8184-7a7b34febe3b',
                  visningsnavn: 'Byggdrifterfaget',
                  valgt: false
                },
                {
                  id: '4bbc1c93-060c-4384-b33c-83c926ecd79b',
                  visningsnavn: 'Byggmontasjefaget',
                  valgt: false
                },
                {
                  id: 'c8ac69fa-6ba6-494f-95e1-6ec9be06086d',
                  visningsnavn: 'Fjell- og bergverksfaget',
                  valgt: false
                },
                {
                  id: '43b8c872-5a7e-4fa2-8494-dd3258d60ad0',
                  visningsnavn: 'Glassfaget',
                  valgt: false
                },
                {
                  id: '996c8711-41e0-4198-80b2-8152e70838a8',
                  visningsnavn: 'Industrimalerfaget',
                  valgt: false
                },
                {
                  id: '609e85d8-cfb0-4246-ba84-9d32b0ae3fb9',
                  visningsnavn: 'Isolatørfaget',
                  valgt: false
                },
                {
                  id: '5e26c1a9-ffea-4d20-a993-33d66e8836fb',
                  visningsnavn: 'Maler- og overflateteknikkfaget',
                  valgt: false
                },
                {
                  id: '223f1772-a177-4643-80da-6f545bfa278c',
                  visningsnavn: 'Murer- og flisleggerfaget',
                  valgt: false
                },
                {
                  id: '11df462d-8f32-4b0d-8a1c-cf8481f2360c',
                  visningsnavn: 'Renholdsoperatørfaget',
                  valgt: false
                },
                {
                  id: 'ff231a65-86d0-4dd5-8efc-af180a1f591a',
                  visningsnavn: 'Rørleggerfaget',
                  valgt: false
                },
                {
                  id: '157ad180-20b7-48e9-8807-b0cfe002470f',
                  visningsnavn: 'Snekkerfaget',
                  valgt: false
                },
                {
                  id: '3bf6dd1b-8609-4daa-96aa-1448271758d1',
                  visningsnavn: 'Steinfaget',
                  valgt: false
                },
                {
                  id: 'f782a360-84dc-4235-84bd-9f2c2ea420d4',
                  visningsnavn: 'Stillasbyggerfaget',
                  valgt: false
                },
                {
                  id: '7d9679f1-93b4-4bce-9b59-6a45a1c964d4',
                  visningsnavn: 'Tak- og membrantekkerfaget',
                  valgt: false
                },
                {
                  id: '291287d3-8cdd-4f95-863a-6c6bdee822eb',
                  visningsnavn: 'Tømrerfaget',
                  valgt: false
                },
                {
                  id: '4e383446-bc03-4bff-9477-730f66cfdfa7',
                  visningsnavn: 'Trelast- og limtreproduksjonsfaget',
                  valgt: false
                },
                {
                  id: '32222048-2753-4bb0-98bb-7e2a88c1d790',
                  visningsnavn: 'Veidrift- og veivedlikeholdsfaget',
                  valgt: false
                },
                {
                  id: 'a2287ed9-6349-47ff-9cbe-5bdbb0b6cf2c',
                  visningsnavn: 'Vei- og anleggsfaget',
                  valgt: false
                },
                {
                  id: 'c204f807-09b1-4c5e-be21-2379dec3e650',
                  visningsnavn: 'Ventilasjons- og blikkenslagerfaget',
                  valgt: false
                }
              ]
            }
          },
          {
            id: 'f1bc4b14-56d6-4907-8fdf-48c982a4c759',
            visningsnavn: 'Elektro og datateknologi',
            larefag: {
              id: null,
              visningsnavn: 'Lærefag',
              pakrevd: true,
              representerer: OpplaringRepresenterer.LAREFAG,
              seleksjonstype: Seleksjonstype.FLERVALG,
              alternativer: [
                {
                  id: '12db8a0a-93cc-4aae-bd17-49ffe7ebd0a4',
                  visningsnavn: 'Automatiseringsfaget',
                  valgt: false
                },
                {
                  id: 'd2c523ae-e9a7-4cad-884e-6b0efee2dc1e',
                  visningsnavn: 'Avionikerfaget',
                  valgt: false
                },
                {
                  id: '9db6b564-a7ea-404e-9898-223e86177805',
                  visningsnavn: 'Dataelektronikerfaget',
                  valgt: false
                },
                {
                  id: '7e072c5c-79a8-47ba-8a71-39a579975340',
                  visningsnavn: 'Droneoperatørfaget',
                  valgt: false
                },
                {
                  id: 'cf20e956-2048-45d1-b26f-af7331ffb392',
                  visningsnavn: 'Elektrikerfaget',
                  valgt: false
                },
                {
                  id: 'b7f3a8db-2fae-4a05-86bc-2b93b0f2fe4b',
                  visningsnavn: 'Elektroreparatørfaget',
                  valgt: false
                },
                {
                  id: 'c3b948f6-cafc-4647-91c2-3a80bae6fc8f',
                  visningsnavn: 'Energimontørfaget',
                  valgt: false
                },
                {
                  id: '38fae8e1-c810-409d-adab-cc25c6163f74',
                  visningsnavn: 'Energioperatørfaget',
                  valgt: false
                },
                {
                  id: 'f81214d4-f808-4bfd-8c8b-d806520e34a6',
                  visningsnavn: 'Fjernstyrte undervannsoperasjoner',
                  valgt: false
                },
                {
                  id: '1d00d3be-6b02-427c-818a-562a20e025ca',
                  visningsnavn: 'Flymotormekanikerfaget',
                  valgt: false
                },
                {
                  id: 'ecb90913-9086-4dda-9da1-3c48dcd1e344',
                  visningsnavn: 'Flystrukturmekanikerfaget',
                  valgt: false
                },
                {
                  id: '0290a875-3515-479d-a325-c61c3bbea022',
                  visningsnavn: 'Flysystemmekanikerfaget',
                  valgt: false
                },
                {
                  id: 'f4b3938c-e3ad-4ced-ba4b-012a073b2a61',
                  visningsnavn: 'Flytekniske fag',
                  valgt: false
                },
                {
                  id: 'c347e158-08e8-495f-84ef-e837e7f615fe',
                  visningsnavn: 'Heismontørfaget',
                  valgt: false
                },
                {
                  id: '3e03b314-81c5-4d93-8142-986c52cfbb7e',
                  visningsnavn: 'Kulde- og varmepumpeteknikkfaget',
                  valgt: false
                },
                {
                  id: '4ff345d9-221c-4e9a-a50a-6a8480805960',
                  visningsnavn: 'Låsesmedfaget',
                  valgt: false
                },
                {
                  id: 'ddec6cb8-b5ae-418f-8466-b321ce13879c',
                  visningsnavn: 'Maritim elektrikerfaget',
                  valgt: false
                },
                {
                  id: '57fee16c-c3db-4eb6-9087-61a111849242',
                  visningsnavn: 'Optronikerfaget',
                  valgt: false
                },
                {
                  id: '50a3b8ed-ed5b-472b-b3c7-b090c48220ff',
                  visningsnavn: 'Produksjonselektronikerfaget',
                  valgt: false
                },
                {
                  id: '64f83340-de6b-48a2-9188-adc48e2508c1',
                  visningsnavn: 'Romteknologi',
                  valgt: false
                },
                {
                  id: '97df5c1e-a2c6-443b-b061-b23c7164c645',
                  visningsnavn: 'Signalmontørfaget',
                  valgt: false
                },
                {
                  id: '6a75f3bc-4fcb-461b-a6f0-c5e0c1140ab7',
                  visningsnavn: 'Tavlemontørfaget',
                  valgt: false
                },
                {
                  id: '85548661-c09a-4d26-be8b-dbcb443c387d',
                  visningsnavn: 'Telekommunikasjonsmontørfaget',
                  valgt: false
                },
                {
                  id: '9dc87197-145a-4511-acc5-39f8a2e7efe4',
                  visningsnavn: 'Togelektrikerfaget',
                  valgt: false
                },
                {
                  id: '03c2bffc-0e2c-43b8-8a73-d7d7c71d99dc',
                  visningsnavn: 'Ventilasjonsteknikkfaget',
                  valgt: false
                },
                {
                  id: 'a9399f0e-fefc-4bf0-be3c-2721e56156fe',
                  visningsnavn: 'Viklerfaget',
                  valgt: false
                }
              ]
            }
          },
          {
            id: '9891aeef-1f72-49a1-9713-971952edfa09',
            visningsnavn: 'Frisør, blomster, interiør og eksponeringsdesign',
            larefag: {
              id: null,
              visningsnavn: 'Lærefag',
              pakrevd: true,
              representerer: OpplaringRepresenterer.LAREFAG,
              seleksjonstype: Seleksjonstype.FLERVALG,
              alternativer: [
                {
                  id: 'b1d31805-6442-4867-bc7d-37c9de55bfea',
                  visningsnavn: 'Blomsterdekoratørfaget',
                  valgt: false
                },
                {
                  id: '092dd970-a856-4c2e-a082-bcac71a9acef',
                  visningsnavn: 'Frisørfaget',
                  valgt: false
                },
                {
                  id: '3f94cbae-7475-467c-b3e1-c7f8da80d168',
                  visningsnavn: 'Interiør',
                  valgt: false
                },
                {
                  id: '7ff987be-8151-46e7-aa39-bab7c61b7204',
                  visningsnavn: 'Maskør- og parykkmakerfaget',
                  valgt: false
                },
                {
                  id: 'e8727d9b-1d63-471a-95b3-a6e408b46e69',
                  visningsnavn: 'Profileringsdesignfaget',
                  valgt: false
                }
              ]
            }
          },
          {
            id: '1626096d-f1ac-4c34-aa93-741503bc5584',
            visningsnavn: 'Håndverk, design og produktutvikling',
            larefag: {
              id: null,
              visningsnavn: 'Lærefag',
              pakrevd: true,
              representerer: OpplaringRepresenterer.LAREFAG,
              seleksjonstype: Seleksjonstype.FLERVALG,
              alternativer: [
                {
                  id: '5ddd73f0-f6ab-46a4-84f7-deed6ea14491',
                  visningsnavn: 'Bilsalmakerfaget',
                  valgt: false
                },
                {
                  id: '2ff61af1-0b54-4bac-ba97-83baf385ad8f',
                  visningsnavn: 'Blyglasshåndverkerfaget',
                  valgt: false
                },
                {
                  id: '63b03ed1-d004-4ffd-8268-9c9fbde546c7',
                  visningsnavn: 'Bøkkerfaget',
                  valgt: false
                },
                {
                  id: '649e9784-0422-4216-9cea-5af581a5c9c4',
                  visningsnavn: 'Bunadstilvirkerfaget',
                  valgt: false
                },
                {
                  id: '6ea0c70a-9980-4ce4-ae16-ba5071b5e8fa',
                  visningsnavn: 'Buntmakerfaget',
                  valgt: false
                },
                {
                  id: '7ad7fa3a-bfc7-47f3-a0ce-2cc91235e33d',
                  visningsnavn: 'Filigranssølvsmedfaget',
                  valgt: false
                },
                {
                  id: '18ef4873-b71b-47b7-8919-1cb9814aafd2',
                  visningsnavn: 'Forgyllerfaget',
                  valgt: false
                },
                {
                  id: '471b38f2-13d3-4b97-b835-4b69861a9d1b',
                  visningsnavn: 'Garverfaget',
                  valgt: false
                },
                {
                  id: '2ea1c728-077b-43d9-8f5e-11980e64a34b',
                  visningsnavn: 'Gipsmakerfaget',
                  valgt: false
                },
                {
                  id: '74db0d0a-549f-4421-b30d-a11a34ede018',
                  visningsnavn: 'Gjørtlerfaget',
                  valgt: false
                },
                {
                  id: '7a7a7c50-4800-4e97-be97-f4a87216c8f5',
                  visningsnavn: 'Glassblåserfaget',
                  valgt: false
                },
                {
                  id: '566cbfce-814b-465f-9fa9-9d013c0f149d',
                  visningsnavn: 'Gravørfaget',
                  valgt: false
                },
                {
                  id: 'e50a52c4-cf6e-4a56-bfa3-29a18bee4ace',
                  visningsnavn: 'Gullsmedfaget',
                  valgt: false
                },
                {
                  id: 'a3af15d2-f5d4-4317-81a3-c376eb68a48c',
                  visningsnavn: 'Håndbokbinderfaget',
                  valgt: false
                },
                {
                  id: 'd208ccd6-1c39-4ca0-a4c2-fb9febe88b75',
                  visningsnavn: 'Håndveverfaget',
                  valgt: false
                },
                {
                  id: 'c1092785-1fb1-4aee-ad96-1b8a8069bb1e',
                  visningsnavn: 'Herreskredderfaget',
                  valgt: false
                },
                {
                  id: '48b358ab-d2bf-4af9-9b20-39e0c3dfbe31',
                  visningsnavn: 'Horn-, bein- og metallduodjifaget',
                  valgt: false
                },
                {
                  id: '111529c5-8653-4126-bcc2-12c54fff8c65',
                  visningsnavn: 'Keramikerfaget',
                  valgt: false
                },
                {
                  id: 'd30d70e0-3a14-49eb-927f-406a813510e8',
                  visningsnavn: 'Kjole- og draktsyerfaget',
                  valgt: false
                },
                {
                  id: '9c9c91ce-1feb-420b-8036-0bb9222e2b1e',
                  visningsnavn: 'Komposittbåtbyggerfaget',
                  valgt: false
                },
                {
                  id: '7d9403b6-7883-4322-b340-c702e143c802',
                  visningsnavn: 'Kostymesyerfaget',
                  valgt: false
                },
                {
                  id: 'acd8bf38-0eaa-4f4c-8854-4dc8313557ac',
                  visningsnavn: 'Kurvmakerfaget',
                  valgt: false
                },
                {
                  id: 'f03cac60-2001-4e3d-b875-fa7b431c04d0',
                  visningsnavn: 'Møbelsnekkerfaget',
                  valgt: false
                },
                {
                  id: '9cd8819c-4b28-44d6-9770-f62b94f3551d',
                  visningsnavn: 'Møbeltapetsererfaget',
                  valgt: false
                },
                {
                  id: 'aa23263d-e938-4241-8e20-860c33c0ea39',
                  visningsnavn: 'Modistfaget',
                  valgt: false
                },
                {
                  id: '5932628a-d65e-48a0-994b-edb2a3d6026f',
                  visningsnavn: 'Orgelbyggerfaget',
                  valgt: false
                },
                {
                  id: 'fb8e5d20-cdb8-4ed3-b121-730ca1a98fab',
                  visningsnavn: 'Repslagerfaget',
                  valgt: false
                },
                {
                  id: '5746b3f4-5853-47cf-81d1-b10a65b47b97',
                  visningsnavn: 'Salmakerfaget',
                  valgt: false
                },
                {
                  id: '0c909f2b-81bf-46a2-b2cd-b61dde4ccd91',
                  visningsnavn: 'Seilmakerfaget',
                  valgt: false
                },
                {
                  id: '74370f3e-8c7b-4b85-960c-0c3fb474809f',
                  visningsnavn: 'Skinn- og pelsduodjifaget',
                  valgt: false
                },
                {
                  id: '01204573-ddeb-4ae8-a23e-1c0cfdc95fa6',
                  visningsnavn: 'Skomakerfaget',
                  valgt: false
                },
                {
                  id: 'a8b5f9ad-fa8c-4c0b-8146-31db23658011',
                  visningsnavn: 'Smedfaget',
                  valgt: false
                },
                {
                  id: '24834ece-56cb-4bbc-acf2-ccb97f079b68',
                  visningsnavn: 'Sølvsmedfaget',
                  valgt: false
                },
                {
                  id: '33551dfd-abac-48e8-a10f-4a6631effbe2',
                  visningsnavn: 'Strikkefaget',
                  valgt: false
                },
                {
                  id: 'e2c92b8f-0e03-4415-bbb3-077a1928b18c',
                  visningsnavn: 'Taksidermistfaget',
                  valgt: false
                },
                {
                  id: '32cadb39-f49a-4219-835c-41e906f00540',
                  visningsnavn: 'Tekstilduodjifaget',
                  valgt: false
                },
                {
                  id: '664d8666-6d07-4028-b08e-71fbebc03821',
                  visningsnavn: 'Trebåtbyggerfaget',
                  valgt: false
                },
                {
                  id: 'b301414c-920f-458e-9f9e-b549de3791f2',
                  visningsnavn: 'Tredreierfaget',
                  valgt: false
                },
                {
                  id: 'b9443a1d-def2-49a7-a273-432e69822b45',
                  visningsnavn: 'Treduodjifaget',
                  valgt: false
                },
                {
                  id: '74f81663-f8e8-45c1-aa81-0dce2c03bcf0',
                  visningsnavn: 'Treskjærerfaget',
                  valgt: false
                },
                {
                  id: 'b68508cb-faa9-4e3d-90bc-554c90842244',
                  visningsnavn: 'Ull- og garnduodjifaget',
                  valgt: false
                },
                {
                  id: 'dd9757b4-183e-418a-9a3c-3972909318f3',
                  visningsnavn: 'Urmakerfaget',
                  valgt: false
                }
              ]
            }
          },
          {
            id: 'b1dabf02-b6f6-4052-8f13-88a83006ea98',
            visningsnavn: 'Helse- og oppvekstfag',
            larefag: {
              id: null,
              visningsnavn: 'Lærefag',
              pakrevd: true,
              representerer: OpplaringRepresenterer.LAREFAG,
              seleksjonstype: Seleksjonstype.FLERVALG,
              alternativer: [
                {
                  id: '3a317bb4-bc5e-4f65-986d-f999e0acd20f',
                  visningsnavn: 'Aktivitørfaget',
                  valgt: false
                },
                {
                  id: 'fd1b7b5b-d1a7-4eef-b55c-38d2dfccd1cb',
                  visningsnavn: 'Ambulansefaget',
                  valgt: false
                },
                {
                  id: '36ddc53f-0649-4f7e-adb8-395505980e63',
                  visningsnavn: 'Apotekteknikk',
                  valgt: false
                },
                {
                  id: 'c51e2156-499a-413d-a2d5-39415eb24a68',
                  visningsnavn: 'Barne- og ungdomsarbeiderfaget',
                  valgt: false
                },
                {
                  id: 'b99267e7-bb22-4998-889b-5202b70e1a1c',
                  visningsnavn: 'Fotterapi',
                  valgt: false
                },
                {
                  id: '6138aa69-44f3-4b7c-9d88-baa164fb0809',
                  visningsnavn: 'Helsearbeiderfaget',
                  valgt: false
                },
                {
                  id: 'bca980ca-bf31-47b4-9bdd-5e7bd48135d2',
                  visningsnavn: 'Helsesekretær',
                  valgt: false
                },
                {
                  id: 'ac1a0cd9-6632-4ad7-8ef7-ab40f0bc6b82',
                  visningsnavn: 'Hudterapi',
                  valgt: false
                },
                {
                  id: 'f1f32c71-5567-49b6-bb80-1e7009f745f4',
                  visningsnavn: 'Ortopediteknikkfaget',
                  valgt: false
                },
                {
                  id: '61fd524c-f8ed-4ca5-b31b-7dbae94c1693',
                  visningsnavn: 'Portørfaget',
                  valgt: false
                },
                {
                  id: 'b98be355-2482-4dd6-96a2-c3f82a179b72',
                  visningsnavn: 'Tannhelsesekretær',
                  valgt: false
                }
              ]
            }
          },
          {
            id: '8265e7bc-e249-406b-bddc-37874cb08e4e',
            visningsnavn: 'Informasjonsteknologi og medieproduksjon',
            larefag: {
              id: null,
              visningsnavn: 'Lærefag',
              pakrevd: true,
              representerer: OpplaringRepresenterer.LAREFAG,
              seleksjonstype: Seleksjonstype.FLERVALG,
              alternativer: [
                {
                  id: 'f94f94f8-9f0a-4f70-904d-2e22281da6fb',
                  visningsnavn: 'Innholdsproduksjonsfaget',
                  valgt: false
                },
                {
                  id: '0f36252d-b6e1-4172-bcd6-6a015ca088f6',
                  visningsnavn: 'IT-driftsfaget',
                  valgt: false
                },
                {
                  id: 'aa16ec8e-30a6-402e-8a5f-b24701212c01',
                  visningsnavn: 'IT-utviklerfaget',
                  valgt: false
                },
                {
                  id: '75125dce-a045-4406-9cda-8c67d3674117',
                  visningsnavn: 'Mediedesignfaget',
                  valgt: false
                },
                {
                  id: 'a893bb66-cfdd-442c-8bcb-a481d36090d9',
                  visningsnavn: 'Medieteknikkfaget',
                  valgt: false
                }
              ]
            }
          },
          {
            id: '6f525cfb-afa8-4e03-88f5-50185f8a7220',
            visningsnavn: 'Naturbruk',
            larefag: {
              id: null,
              visningsnavn: 'Lærefag',
              pakrevd: true,
              representerer: OpplaringRepresenterer.LAREFAG,
              seleksjonstype: Seleksjonstype.FLERVALG,
              alternativer: [
                {
                  id: '898fea75-06d0-48a4-915d-52e89a81014a',
                  visningsnavn: 'Akvakulturfaget',
                  valgt: false
                },
                {
                  id: 'a0a7fd53-b1c1-432a-abd8-f6c4319a54aa',
                  visningsnavn: 'Dyrefaget',
                  valgt: false
                },
                {
                  id: '11a04811-f931-471e-a9e3-d87df9ee2ff1',
                  visningsnavn: 'Fiske og fangst',
                  valgt: false
                },
                {
                  id: '566c02c1-f60e-4aec-82c4-ecab4db27f69',
                  visningsnavn: 'Gartnerfaget',
                  valgt: false
                },
                {
                  id: '1b2f4970-c4b9-4d78-974f-ec81f0d6de87',
                  visningsnavn: 'Havbruksteknikkfaget',
                  valgt: false
                },
                {
                  id: 'a3d1f839-bee9-43d2-aee9-81e468db95b8',
                  visningsnavn: 'Hestefaget',
                  valgt: false
                },
                {
                  id: '00f532aa-20ee-4ecc-9c12-245d8d38c16e',
                  visningsnavn: 'Hovslagerfaget',
                  valgt: false
                },
                {
                  id: '48fc81b1-882f-4311-ba15-d862e8b09722',
                  visningsnavn: 'Landbruk',
                  valgt: false
                },
                {
                  id: 'efafd2a3-e433-4bd9-a665-ce3e839b76b8',
                  visningsnavn: 'Landbruksfaget',
                  valgt: false
                },
                {
                  id: 'f3601cca-29f3-40b1-ba1b-2fa5fcb6b998',
                  visningsnavn: 'Reindriftsfaget',
                  valgt: false
                },
                {
                  id: '215dc717-c1c9-4a27-8fdb-113acee91c11',
                  visningsnavn: 'Skogfaget',
                  valgt: false
                }
              ]
            }
          },
          {
            id: '1611a38f-b6d2-4761-844f-cd9ff9cc58b7',
            visningsnavn: 'Restaurant- og matfag',
            larefag: {
              id: null,
              visningsnavn: 'Lærefag',
              pakrevd: true,
              representerer: OpplaringRepresenterer.LAREFAG,
              seleksjonstype: Seleksjonstype.FLERVALG,
              alternativer: [
                {
                  id: '0bf8c2fb-46cf-411c-b06d-1226b0fae963',
                  visningsnavn: 'Bakerfaget',
                  valgt: false
                },
                {
                  id: 'b32848b3-e368-47b6-a1bd-6c6f398894c4',
                  visningsnavn: 'Ernæringskokkfaget',
                  valgt: false
                },
                {
                  id: '6bf71ea8-cd20-4395-82a8-3cf9c522b7e1',
                  visningsnavn: 'Ferskvarehandlerfaget',
                  valgt: false
                },
                {
                  id: '41a7e1b2-a497-4464-9795-19ef0ab663aa',
                  visningsnavn: 'Industriell matproduksjon',
                  valgt: false
                },
                {
                  id: 'f78143f5-493c-42a0-bb5b-671c5f90466d',
                  visningsnavn: 'Kjøttskjærerfaget',
                  valgt: false
                },
                {
                  id: '0181953c-8c97-420b-8667-2ecdcd4310b5',
                  visningsnavn: 'Kokkfaget',
                  valgt: false
                },
                {
                  id: '140bc83a-72f2-43e8-994b-f8f8085e03c4',
                  visningsnavn: 'Konditorfaget',
                  valgt: false
                },
                {
                  id: '2b56beb7-33ef-4f73-aeba-31aafbc48a02',
                  visningsnavn: 'Pølsemakerfaget',
                  valgt: false
                },
                {
                  id: '70ef8bff-a4b7-46fd-91d8-098eb19a377b',
                  visningsnavn: 'Servitørfaget',
                  valgt: false
                },
                {
                  id: '774691bf-ed4c-4c4e-84b6-6d7c0ee5bc6b',
                  visningsnavn: 'Sjømatproduksjon',
                  valgt: false
                },
                {
                  id: '2c247b1d-9c38-4153-be7d-b115898aeec6',
                  visningsnavn: 'Slakterfaget',
                  valgt: false
                }
              ]
            }
          },
          {
            id: '41d749f7-8969-44a6-a97d-8d45419ad002',
            visningsnavn: 'Salg, service og reiseliv',
            larefag: {
              id: null,
              visningsnavn: 'Lærefag',
              pakrevd: true,
              representerer: OpplaringRepresenterer.LAREFAG,
              seleksjonstype: Seleksjonstype.FLERVALG,
              alternativer: [
                {
                  id: '0f22fdc4-60c3-4480-87a3-5361c7341c27',
                  visningsnavn: 'Reiselivsfaget',
                  valgt: false
                },
                {
                  id: '3d4f415c-d5ee-42ee-897d-0888d5fe1e22',
                  visningsnavn: 'Salgsfaget',
                  valgt: false
                },
                {
                  id: 'a986d521-8acc-471e-8df5-cf4abc93cf67',
                  visningsnavn: 'Service- og administrasjonsfaget',
                  valgt: false
                },
                {
                  id: '4976b38c-dd1f-4223-bceb-cd2378b06b6c',
                  visningsnavn: 'Sikkerhetsfaget',
                  valgt: false
                }
              ]
            }
          },
          {
            id: 'd782b53f-bed7-47ae-917d-d44c0c850499',
            visningsnavn: 'Teknologi- og industrifag',
            larefag: {
              id: null,
              visningsnavn: 'Lærefag',
              pakrevd: true,
              representerer: OpplaringRepresenterer.LAREFAG,
              seleksjonstype: Seleksjonstype.FLERVALG,
              alternativer: [
                {
                  id: '3b58d1f6-9ed6-4c11-8983-e441c530aa27',
                  visningsnavn: 'Aluminiumskonstruksjonsfaget',
                  valgt: false
                },
                {
                  id: '937eacf2-dc1b-4959-9a13-ef268c167bdd',
                  visningsnavn: 'Anleggsmaskinmekanikerfaget',
                  valgt: false
                },
                {
                  id: 'ccdc1972-c63c-42e9-a08f-ec4f62d8513b',
                  visningsnavn: 'Bilfaget, lette kjøretøy',
                  valgt: false
                },
                {
                  id: 'ebd88b90-43e1-41e5-93a2-15d3fd7bd23c',
                  visningsnavn: 'Bilfaget, tunge kjøretøy',
                  valgt: false
                },
                {
                  id: 'd7f03c9e-2027-4045-b91f-f9c3b8a194a4',
                  visningsnavn: 'Billakkererfaget',
                  valgt: false
                },
                {
                  id: '7c14f562-d40f-413a-86cd-b557d68f2b4c',
                  visningsnavn: 'Bilpleiefaget',
                  valgt: false
                },
                {
                  id: '19ab26ac-3c4c-4062-9e5b-c67782858c6d',
                  visningsnavn: 'Bilskadefaget',
                  valgt: false
                },
                {
                  id: '5d593f1e-c55b-47bf-baf2-75a5e1a19358',
                  visningsnavn: 'Boreoperatørfaget',
                  valgt: false
                },
                {
                  id: '4724e375-43bf-4392-8ce9-fd623ad63735',
                  visningsnavn: 'Børsemakerfaget',
                  valgt: false
                },
                {
                  id: '17e726bb-c51d-46ab-9a3f-456d2f8bc5a5',
                  visningsnavn: 'Brønnfaget, elektriske kabeloperasjoner',
                  valgt: false
                },
                {
                  id: '8c4e4b93-5612-4574-9a3b-858877135a9f',
                  visningsnavn: 'Brønnfaget, havbunnsinstallasjoner',
                  valgt: false
                },
                {
                  id: '3d048284-5b09-4eef-b20f-d69325b9aeff',
                  visningsnavn: 'Brønnfaget, komplettering',
                  valgt: false
                },
                {
                  id: 'a061e6c0-be92-409e-afe9-6118a2b0acf8',
                  visningsnavn: 'Brønnfaget, kveilerøroperasjoner',
                  valgt: false
                },
                {
                  id: 'b34fe8b9-1914-46b8-8875-312079984a92',
                  visningsnavn: 'Brønnfaget, mekaniske kabeloperasjoner',
                  valgt: false
                },
                {
                  id: '1579a2b0-ef6f-4ec9-b250-fcbf709669ab',
                  visningsnavn: 'Brønnfaget, sementering',
                  valgt: false
                },
                {
                  id: '82913206-4f84-4225-bb85-dfb948f9c42d',
                  visningsnavn: 'Chassispåbyggerfaget',
                  valgt: false
                },
                {
                  id: '86e9a498-18b4-4edb-9c7e-30977d1adceb',
                  visningsnavn: 'CNC-maskineringsfaget',
                  valgt: false
                },
                {
                  id: '91c4f92a-2e62-4e46-8e79-8c27ec3b4dc1',
                  visningsnavn: 'Dimensjonskontrollfaget',
                  valgt: false
                },
                {
                  id: '036f2ce3-ea22-40b5-963e-2dc572590dec',
                  visningsnavn: 'Finmekanikerfaget',
                  valgt: false
                },
                {
                  id: '2d11795b-c76d-470b-9e68-2f4d1e85dde4',
                  visningsnavn: 'Gjenvinningsfaget',
                  valgt: false
                },
                {
                  id: 'f3647906-3e12-4f68-b489-4465a67660d6',
                  visningsnavn: 'Grafisk produksjonsteknikkfaget',
                  valgt: false
                },
                {
                  id: '0b016383-5f26-4be0-ad98-cd69ae6700c2',
                  visningsnavn: 'Hjulutrustningsfaget',
                  valgt: false
                },
                {
                  id: '52f3f967-e98e-4705-8e72-8d16a614a705',
                  visningsnavn: 'Industriell overflatebehandling',
                  valgt: false
                },
                {
                  id: '6e4c866e-7805-4c6d-9df4-e83c6e2a7075',
                  visningsnavn: 'Industrimekanikerfaget',
                  valgt: false
                },
                {
                  id: '516fbd47-0f55-4e03-be19-c304cc2e963f',
                  visningsnavn: 'Industrimontørfaget',
                  valgt: false
                },
                {
                  id: '7d8c8e4b-0e84-4965-800f-d79e6e4fe8bb',
                  visningsnavn: 'Industrioppmålingsfaget',
                  valgt: false
                },
                {
                  id: 'd310ca06-03aa-4681-86f9-2c8bb008d33e',
                  visningsnavn: 'Industrirørleggerfaget',
                  valgt: false
                },
                {
                  id: 'cef9060d-ce4e-4587-900c-c465abd09ac7',
                  visningsnavn: 'Industrisnekkerfaget',
                  valgt: false
                },
                {
                  id: 'c8fd3aa9-cda0-4290-ab2b-b6df8640f5f2',
                  visningsnavn: 'Industritapetsererfaget',
                  valgt: false
                },
                {
                  id: '64c3f0a8-6f72-48d1-81f2-615d8780081d',
                  visningsnavn: 'Industritekstilfaget',
                  valgt: false
                },
                {
                  id: 'a8f669ef-806f-48f2-9c3d-174338bea881',
                  visningsnavn: 'Kjemiprosessfaget',
                  valgt: false
                },
                {
                  id: 'a020fa9a-c530-4f35-97a7-9eb862d8aca3',
                  visningsnavn: 'Kran- og løfteoperasjonsfaget',
                  valgt: false
                },
                {
                  id: 'b8c5e222-0359-4aa0-826b-5af8a2e56191',
                  visningsnavn: 'Laboratoriefaget',
                  valgt: false
                },
                {
                  id: 'abe3a4d9-3a3f-4b86-9fe5-bdb2733c5bc4',
                  visningsnavn: 'Landbruksmaskinmekanikerfaget',
                  valgt: false
                },
                {
                  id: '2b5bf857-cc8e-499c-8e09-1aa853bf3bc0',
                  visningsnavn: 'Logistikkfaget',
                  valgt: false
                },
                {
                  id: '0ba928f2-94b2-41c9-8be6-3fdba7291898',
                  visningsnavn: 'Matrosfaget',
                  valgt: false
                },
                {
                  id: '3c394361-c808-4d25-a33c-8efd219c7473',
                  visningsnavn: 'Modellbyggerfaget',
                  valgt: false
                },
                {
                  id: '53000f6d-0277-41de-b099-75ee75dfd443',
                  visningsnavn: 'Motormekanikerfaget',
                  valgt: false
                },
                {
                  id: 'b764360d-e570-4303-84cb-8e784ed98c23',
                  visningsnavn: 'Motorsykkelfaget',
                  valgt: false
                },
                {
                  id: '7a3edec1-f78f-40fc-a585-9844710271e6',
                  visningsnavn: 'NDT-kontrollørfaget',
                  valgt: false
                },
                {
                  id: '1b204fbf-9f96-401a-9bd0-6034d6f80b38',
                  visningsnavn: 'Plastfaget',
                  valgt: false
                },
                {
                  id: 'a4792421-50de-4f07-bd2e-fee916ee29be',
                  visningsnavn: 'Platearbeiderfaget',
                  valgt: false
                },
                {
                  id: '9aac3d52-e6b2-45b4-a14b-5808c565a398',
                  visningsnavn: 'Polymerkomposittfaget',
                  valgt: false
                },
                {
                  id: 'f7207634-6656-4438-89d2-7ee09f467b97',
                  visningsnavn: 'Produksjonsteknikkfaget',
                  valgt: false
                },
                {
                  id: 'fe65bb16-ddbf-4d29-85c7-5f60be2eba5e',
                  visningsnavn: 'Reservedelsfaget',
                  valgt: false
                },
                {
                  id: 'e71dc2a7-4440-4372-961a-a8c352e82af0',
                  visningsnavn: 'Serigrafifaget',
                  valgt: false
                },
                {
                  id: '84745d0a-3738-4c8f-a42e-28daef5131fe',
                  visningsnavn: 'Skipsmotormekanikerfaget',
                  valgt: false
                },
                {
                  id: 'ca586cff-a2e4-4253-8de9-23b3645fdf39',
                  visningsnavn: 'Sveisefaget',
                  valgt: false
                },
                {
                  id: 'b401503f-79fe-4e9d-981e-f19f599e3ea5',
                  visningsnavn: 'Tekstilrensfaget',
                  valgt: false
                },
                {
                  id: 'ad47521d-0539-451d-9eb9-c30f9d0a90de',
                  visningsnavn: 'Truck- og liftmekanikerfaget',
                  valgt: false
                },
                {
                  id: '78a8bfc0-fdf4-4631-823b-29dc51624d0e',
                  visningsnavn: 'Vaskerifaget',
                  valgt: false
                },
                {
                  id: '44c5b91a-e438-4049-997c-bfdac6098804',
                  visningsnavn: 'Verktøymakerfaget',
                  valgt: false
                },
                {
                  id: '13349d52-8ac4-4b7a-b84a-042057a26cbd',
                  visningsnavn: 'Yrkessjåførfaget',
                  valgt: false
                }
              ]
            }
          }
        ]
      }
    ],
    sertifiseringValg: []
  }
]

export const mockSertifiseringer: KodeverkSertifiseringResponse = [
  { konseptId: 90999, label: 'Datakortet del 1' },
  { konseptId: 2, label: 'Datakortet del 2' },
  { konseptId: 3, label: 'Sertifisert zumba-instruktør' },
  { konseptId: 345, label: 'Godkjent jagerpilot' }
]
