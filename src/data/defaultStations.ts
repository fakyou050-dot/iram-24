export interface RadioStation {
  id: string;
  name: string;
  city: string;
  country: string;
  stream_url: string;
  logo: string;
  category: string;
  enabled: boolean;
}

export const DEFAULT_STATIONS: RadioStation[] = 
[
  {
    "id": "station_1",
    "name": "الإذاعة الجزائرية - البويرة",
    "city": "الجزائر العاصمة",
    "country": "الجزائر",
    "stream_url": "https://webradio.tda.dz/Bouira_64K.mp3",
    "logo": "",
    "category": "الجزائر",
    "enabled": true
  },
  {
    "id": "station_2",
    "name": "الإذاعة الجزائرية - القناة الأولى",
    "city": "الجزائر العاصمة",
    "country": "الجزائر",
    "stream_url": "https://webradio.tda.dz/Chaine1_64K.mp3",
    "logo": "",
    "category": "الجزائر",
    "enabled": true
  },
  {
    "id": "station_3",
    "name": "الإذاعة الجزائرية - تيبازة",
    "city": "الجزائر العاصمة",
    "country": "الجزائر",
    "stream_url": "https://webradio.tda.dz/Tipaza_64K.mp3",
    "logo": "",
    "category": "الجزائر",
    "enabled": true
  },
  {
    "id": "station_4",
    "name": "الإذاعة الجزائرية - إذاعة البهجة",
    "city": "الجزائر العاصمة",
    "country": "الجزائر",
    "stream_url": "https://webradio.tda.dz/ElBahdja_64K.mp3",
    "logo": "",
    "category": "الجزائر",
    "enabled": true
  },
  {
    "id": "station_5",
    "name": "الإذاعة الجزائرية - Jil FM",
    "city": "الجزائر العاصمة",
    "country": "الجزائر",
    "stream_url": "https://webradio.tda.dz/Jeunesse_64K.mp3",
    "logo": "",
    "category": "الجزائر",
    "enabled": true
  },
  {
    "id": "station_6",
    "name": "الإذاعة الجزائرية - بومرداس",
    "city": "الجزائر العاصمة",
    "country": "الجزائر",
    "stream_url": "https://webradio.tda.dz/Boumerdes_64K.mp3",
    "logo": "",
    "category": "الجزائر",
    "enabled": true
  },
  {
    "id": "station_7",
    "name": "Rradio n Dzzayer - Chaîne 2",
    "city": "الجزائر العاصمة",
    "country": "الجزائر",
    "stream_url": "https://webradio.tda.dz/Chaine2_64K.mp3",
    "logo": "",
    "category": "الجزائر",
    "enabled": true
  },
  {
    "id": "station_8",
    "name": "الإذاعة الجزائرية - إذاعة القرآن الكريم",
    "city": "الجزائر العاصمة",
    "country": "الجزائر",
    "stream_url": "https://webradio.tda.dz/Coran_64K.mp3",
    "logo": "",
    "category": "الجزائر",
    "enabled": true
  },
  {
    "id": "station_9",
    "name": "الإذاعة الجزائرية - البليدة",
    "city": "الجزائر العاصمة",
    "country": "الجزائر",
    "stream_url": "https://webradio.tda.dz/Blida_64K.mp3",
    "logo": "",
    "category": "الجزائر",
    "enabled": true
  },
  {
    "id": "station_10",
    "name": "Medi 1 radio",
    "city": "الجزائر العاصمة",
    "country": "الجزائر",
    "stream_url": "https://live.medi1.com/medi1#.mp3",
    "logo": "",
    "category": "الجزائر",
    "enabled": true
  },
  {
    "id": "station_11",
    "name": "بحرين راديو 102.3",
    "city": "المنامة",
    "country": "البحرين",
    "stream_url": "https://5c7b683162943.streamlock.net/live/ngrp:radio-102-3_all/playlist.m3u8",
    "logo": "",
    "category": "البحرين",
    "enabled": true
  },
  {
    "id": "station_12",
    "name": "MBC Loud",
    "city": "المنامة",
    "country": "البحرين",
    "stream_url": "https://d2lfa0y84k5bwn.cloudfront.net/out/v1/86dd4506a70c4d7fb35e2ab50296d9a3/index_8.m3u8",
    "logo": "",
    "category": "البحرين",
    "enabled": true
  },
  {
    "id": "station_13",
    "name": "إذاعة القرآن الكريم",
    "city": "المنامة",
    "country": "البحرين",
    "stream_url": "https://live.kwikmotion.com/sbrksaquranradiolive/ksaquranradio/playlist.m3u8",
    "logo": "",
    "category": "البحرين",
    "enabled": true
  },
  {
    "id": "station_14",
    "name": "إذاعة خزامى",
    "city": "المنامة",
    "country": "البحرين",
    "stream_url": "https://live.kwikmotion.com/sbrksakhuzamaradiolive/khuzama/playlist.m3u8",
    "logo": "",
    "category": "البحرين",
    "enabled": true
  },
  {
    "id": "station_15",
    "name": "مونت كارلو الدولية",
    "city": "المنامة",
    "country": "البحرين",
    "stream_url": "https://montecarlodoualiya128k.ice.infomaniak.ch/mc-doualiya.mp3",
    "logo": "",
    "category": "البحرين",
    "enabled": true
  },
  {
    "id": "station_16",
    "name": "دويتشه فيله (العربية)",
    "city": "المنامة",
    "country": "البحرين",
    "stream_url": "https://dw.audiostream.io/dw/1025/mp3/64/dw05",
    "logo": "",
    "category": "البحرين",
    "enabled": true
  },
  {
    "id": "station_17",
    "name": "بانوراما FM",
    "city": "المنامة",
    "country": "البحرين",
    "stream_url": "https://shls-panoramafm-prod-dub.shahid.net/out/v1/66262e420d824475aaae794dc2d69f14/index.m3u8",
    "logo": "",
    "category": "البحرين",
    "enabled": true
  },
  {
    "id": "station_18",
    "name": "إذاعة نداء الإسلام",
    "city": "المنامة",
    "country": "البحرين",
    "stream_url": "https://live.kwikmotion.com/sbrksanedaradiolive/ksanedaradio/playlist.m3u8",
    "logo": "",
    "category": "البحرين",
    "enabled": true
  },
  {
    "id": "station_19",
    "name": "بحرين FM 93.3",
    "city": "المنامة",
    "country": "البحرين",
    "stream_url": "https://5c7b683162943.streamlock.net/live/ngrp:radio-93-3_all/playlist.m3u8",
    "logo": "",
    "category": "البحرين",
    "enabled": true
  },
  {
    "id": "station_20",
    "name": "إذاعة الرياض",
    "city": "المنامة",
    "country": "البحرين",
    "stream_url": "https://live.kwikmotion.com/sbrksariyadhradiolive/ksariyadhradio/playlist.m3u8",
    "logo": "",
    "category": "البحرين",
    "enabled": true
  },
  {
    "id": "station_21",
    "name": "إذاعة صوت الخليج",
    "city": "المنامة",
    "country": "البحرين",
    "stream_url": "http://ruby.streamguys.com:8120/sar-qatar-2",
    "logo": "",
    "category": "البحرين",
    "enabled": true
  },
  {
    "id": "station_22",
    "name": "إذاعة جدة",
    "city": "المنامة",
    "country": "البحرين",
    "stream_url": "https://live.kwikmotion.com/sbrksajeddahradiolive/ksajeddahradio/playlist.m3u8",
    "logo": "",
    "category": "البحرين",
    "enabled": true
  },
  {
    "id": "station_23",
    "name": "الشعبية 95.0",
    "city": "المنامة",
    "country": "البحرين",
    "stream_url": "https://5c7b683162943.streamlock.net/live/ngrp:radio-95-0_all/playlist.m3u8",
    "logo": "",
    "category": "البحرين",
    "enabled": true
  },
  {
    "id": "station_24",
    "name": "راديو UFM",
    "city": "المنامة",
    "country": "البحرين",
    "stream_url": "http://stream.ufmradio.com:8000/stream",
    "logo": "",
    "category": "البحرين",
    "enabled": true
  },
  {
    "id": "station_25",
    "name": "الشـبـابـيـة 98.4",
    "city": "المنامة",
    "country": "البحرين",
    "stream_url": "https://5c7b683162943.streamlock.net/live/ngrp:radio-98-4_all/playlist.m3u8",
    "logo": "",
    "category": "البحرين",
    "enabled": true
  },
  {
    "id": "station_26",
    "name": "BFBS Bahrain",
    "city": "المنامة",
    "country": "البحرين",
    "stream_url": "https://listen-ssvcbfbs.sharp-stream.com/ssvcbfbs9.aac",
    "logo": "",
    "category": "البحرين",
    "enabled": true
  },
  {
    "id": "station_27",
    "name": "راديو الشرق",
    "city": "المنامة",
    "country": "البحرين",
    "stream_url": "https://svs.itworkscdn.net/asharqradioalive/asharqradioa/playlist.m3u8",
    "logo": "",
    "category": "البحرين",
    "enabled": true
  },
  {
    "id": "station_28",
    "name": "BBC World Service",
    "city": "المنامة",
    "country": "البحرين",
    "stream_url": "https://stream.live.vc.bbcmedia.co.uk/bbc_world_service",
    "logo": "",
    "category": "البحرين",
    "enabled": true
  },
  {
    "id": "station_29",
    "name": "MBC FM",
    "city": "المنامة",
    "country": "البحرين",
    "stream_url": "https://mbcfm-riyadh-prod-dub.shahid.net/out/v1/69c8a03f507e422f99cf5c07291c9e3a/index.m3u8",
    "logo": "",
    "category": "البحرين",
    "enabled": true
  },
  {
    "id": "station_30",
    "name": "إذاعة القرآن الكريم",
    "city": "المنامة",
    "country": "البحرين",
    "stream_url": "https://qmclivestreaming.qa/QURAN/myStream/Playlist.m3u8",
    "logo": "",
    "category": "البحرين",
    "enabled": true
  },
  {
    "id": "station_31",
    "name": "القرآن الكريم 106.1",
    "city": "المنامة",
    "country": "البحرين",
    "stream_url": "https://5c7b683162943.streamlock.net/live/ngrp:radio-106-1_all/playlist.m3u8",
    "logo": "",
    "category": "البحرين",
    "enabled": true
  },
  {
    "id": "station_32",
    "name": "AFN The Eagle (Bahrain)",
    "city": "المنامة",
    "country": "البحرين",
    "stream_url": "https://playerservices.streamtheworld.com/api/livestream-redirect/AFNE_BHNAAC.aac",
    "logo": "",
    "category": "البحرين",
    "enabled": true
  },
  {
    "id": "station_33",
    "name": "ألف ألف FM",
    "city": "المنامة",
    "country": "البحرين",
    "stream_url": "https://alifalifjobs.com/radio/8000/AlifAlifLive.mp3",
    "logo": "",
    "category": "البحرين",
    "enabled": true
  },
  {
    "id": "station_34",
    "name": "إذاعة الكويت البرنامج العام",
    "city": "المنامة",
    "country": "البحرين",
    "stream_url": "https://kwtkrdota.cdn.mangomolo.com/k1rdo/k1rdo.stream_aac/index.m3u8",
    "logo": "",
    "category": "البحرين",
    "enabled": true
  },
  {
    "id": "station_35",
    "name": "رادیو ایران",
    "city": "المنامة",
    "country": "البحرين",
    "stream_url": "https://s1.cdn3.iranseda.ir/liveedge/radio-iran/playlist.m3u8",
    "logo": "",
    "category": "البحرين",
    "enabled": true
  },
  {
    "id": "station_36",
    "name": "رادیو فارس",
    "city": "المنامة",
    "country": "البحرين",
    "stream_url": "https://s1.cdn3.iranseda.ir/liveedgeprovincial/radio-fars/playlist.m3u8",
    "logo": "",
    "category": "البحرين",
    "enabled": true
  },
  {
    "id": "station_37",
    "name": "إذاعة قطر",
    "city": "المنامة",
    "country": "البحرين",
    "stream_url": "https://qmclivestreaming.qa/QRS/myStream/Playlist.m3u8",
    "logo": "",
    "category": "البحرين",
    "enabled": true
  },
  {
    "id": "station_38",
    "name": "رادیو ‎بوشهر",
    "city": "المنامة",
    "country": "البحرين",
    "stream_url": "https://s1.cdn3.iranseda.ir/liveedgeprovincial/radio-bushehr/playlist.m3u8",
    "logo": "",
    "category": "البحرين",
    "enabled": true
  },
  {
    "id": "station_39",
    "name": "اذاعة طهران العربية",
    "city": "المنامة",
    "country": "البحرين",
    "stream_url": "https://s2.cdn1.iranseda.ir/liveedge/radio-arabic/playlist.m3u8",
    "logo": "",
    "category": "البحرين",
    "enabled": true
  },
  {
    "id": "station_40",
    "name": "رادیو فردا",
    "city": "المنامة",
    "country": "البحرين",
    "stream_url": "https://stream.radiojar.com/cp13r2cpn3quv",
    "logo": "",
    "category": "البحرين",
    "enabled": true
  },
  {
    "id": "station_41",
    "name": "RFI Afrique",
    "city": "Moroni",
    "country": "جزر القمر",
    "stream_url": "https://rfiafrique64k.ice.infomaniak.ch/rfiafrique-64.mp3",
    "logo": "",
    "category": "جزر القمر",
    "enabled": true
  },
  {
    "id": "station_42",
    "name": "RM Emissor Prov. de Nampula",
    "city": "Moroni",
    "country": "جزر القمر",
    "stream_url": "https://node.stream-africa.com:8443/Nampula",
    "logo": "",
    "category": "جزر القمر",
    "enabled": true
  },
  {
    "id": "station_43",
    "name": "RM Emissor Prov. de Cabo Delgado",
    "city": "Moroni",
    "country": "جزر القمر",
    "stream_url": "https://node.stream-africa.com:8443/CaboDelgadoFM",
    "logo": "",
    "category": "جزر القمر",
    "enabled": true
  },
  {
    "id": "station_44",
    "name": "RFI Afrique",
    "city": "Djibouti",
    "country": "جيبوتي",
    "stream_url": "https://rfiafrique64k.ice.infomaniak.ch/rfiafrique-64.mp3",
    "logo": "",
    "category": "جيبوتي",
    "enabled": true
  },
  {
    "id": "station_45",
    "name": "مونت كارلو الدولية",
    "city": "Djibouti",
    "country": "جيبوتي",
    "stream_url": "https://montecarlodoualiya128k.ice.infomaniak.ch/mc-doualiya.mp3",
    "logo": "",
    "category": "جيبوتي",
    "enabled": true
  },
  {
    "id": "station_46",
    "name": "BBC Afrique",
    "city": "Djibouti",
    "country": "جيبوتي",
    "stream_url": "https://stream.live.vc.bbcmedia.co.uk/bbc_afrique_radio",
    "logo": "",
    "category": "جيبوتي",
    "enabled": true
  },
  {
    "id": "station_47",
    "name": "BBC World Service",
    "city": "Djibouti",
    "country": "جيبوتي",
    "stream_url": "https://stream.live.vc.bbcmedia.co.uk/bbc_world_service_east_africa",
    "logo": "",
    "category": "جيبوتي",
    "enabled": true
  },
  {
    "id": "station_48",
    "name": "إذاعة الرياض",
    "city": "Djibouti",
    "country": "جيبوتي",
    "stream_url": "https://live.kwikmotion.com/sbrksariyadhradiolive/ksariyadhradio/playlist.m3u8",
    "logo": "",
    "category": "جيبوتي",
    "enabled": true
  },
  {
    "id": "station_49",
    "name": "የኢትዮጵያ ብሔራዊ ሬዲዮ",
    "city": "Djibouti",
    "country": "جيبوتي",
    "stream_url": "https://stream.zeno.fm/ad402tap7yzuv",
    "logo": "",
    "category": "جيبوتي",
    "enabled": true
  },
  {
    "id": "station_50",
    "name": "إذاعة القرآن الكريم",
    "city": "Djibouti",
    "country": "جيبوتي",
    "stream_url": "https://live.kwikmotion.com/sbrksaquranradiolive/ksaquranradio/playlist.m3u8",
    "logo": "",
    "category": "جيبوتي",
    "enabled": true
  },
  {
    "id": "station_51",
    "name": "راديو هيتس",
    "city": "القاهرة",
    "country": "مصر",
    "stream_url": "https://radiohits882.radioca.st/stream",
    "logo": "",
    "category": "مصر",
    "enabled": true
  },
  {
    "id": "station_52",
    "name": "الراديو 9090",
    "city": "القاهرة",
    "country": "مصر",
    "stream_url": "http://9090streaming.mobtada.com/9090FMEGYPT",
    "logo": "",
    "category": "مصر",
    "enabled": true
  },
  {
    "id": "station_53",
    "name": "NRJ مصر",
    "city": "القاهرة",
    "country": "مصر",
    "stream_url": "https://nrjstreaming.ahmed-melege.com/nrjegypt",
    "logo": "",
    "category": "مصر",
    "enabled": true
  },
  {
    "id": "station_54",
    "name": "On Sport FM",
    "city": "القاهرة",
    "country": "مصر",
    "stream_url": "https://carina.streamerr.co:2020/stream/OnSportFM",
    "logo": "",
    "category": "مصر",
    "enabled": true
  },
  {
    "id": "station_55",
    "name": "شعبي اف ام",
    "city": "القاهرة",
    "country": "مصر",
    "stream_url": "https://radio95.radioca.st/;",
    "logo": "",
    "category": "مصر",
    "enabled": true
  },
  {
    "id": "station_56",
    "name": "إذاعة القران الكريم",
    "city": "القاهرة",
    "country": "مصر",
    "stream_url": "http://stream.radiojar.com/8s5u5tpdtwzuv",
    "logo": "",
    "category": "مصر",
    "enabled": true
  },
  {
    "id": "station_57",
    "name": "نجوم إف إم",
    "city": "القاهرة",
    "country": "مصر",
    "stream_url": "https://audio.nrpstream.com/listen/nogoumfm/radio.mp3",
    "logo": "",
    "category": "مصر",
    "enabled": true
  },
  {
    "id": "station_58",
    "name": "Nile FM",
    "city": "القاهرة",
    "country": "مصر",
    "stream_url": "https://ice23.securenetsystems.net/NILE",
    "logo": "",
    "category": "مصر",
    "enabled": true
  },
  {
    "id": "station_59",
    "name": "راديو نغم إف إم",
    "city": "القاهرة",
    "country": "مصر",
    "stream_url": "https://ahmsamir.radioca.st/stream",
    "logo": "",
    "category": "مصر",
    "enabled": true
  },
  {
    "id": "station_60",
    "name": "بي بي سي عربي",
    "city": "القاهرة",
    "country": "مصر",
    "stream_url": "https://stream.live.vc.bbcmedia.co.uk/bbc_arabic_radio",
    "logo": "",
    "category": "مصر",
    "enabled": true
  },
  {
    "id": "station_61",
    "name": "BBC World Sevice",
    "city": "القاهرة",
    "country": "مصر",
    "stream_url": "https://stream.live.vc.bbcmedia.co.uk/bbc_world_service",
    "logo": "",
    "category": "مصر",
    "enabled": true
  },
  {
    "id": "station_62",
    "name": "إذاعة القرأن الكريم",
    "city": "القاهرة",
    "country": "مصر",
    "stream_url": "https://live.kwikmotion.com/sbrksaquranradiolive/ksaquranradio/playlist.m3u8",
    "logo": "",
    "category": "مصر",
    "enabled": true
  },
  {
    "id": "station_63",
    "name": "إذاعة الرياض",
    "city": "القاهرة",
    "country": "مصر",
    "stream_url": "https://live.kwikmotion.com/sbrksariyadhradiolive/ksariyadhradio/playlist.m3u8",
    "logo": "",
    "category": "مصر",
    "enabled": true
  },
  {
    "id": "station_64",
    "name": "راديو ألوان FM",
    "city": "القاهرة",
    "country": "مصر",
    "stream_url": "https://stream.zeno.fm/fhhhcrvxhchvv",
    "logo": "",
    "category": "مصر",
    "enabled": true
  },
  {
    "id": "station_65",
    "name": "راديو الرجال FM",
    "city": "القاهرة",
    "country": "مصر",
    "stream_url": "https://stream.zeno.fm/ebitxokyr7ptv",
    "logo": "",
    "category": "مصر",
    "enabled": true
  },
  {
    "id": "station_66",
    "name": "إذاعة القران الكريم",
    "city": "الإسكندرية",
    "country": "مصر",
    "stream_url": "http://stream.radiojar.com/8s5u5tpdtwzuv",
    "logo": "",
    "category": "مصر",
    "enabled": true
  },
  {
    "id": "station_67",
    "name": "الراديو 9090",
    "city": "الإسكندرية",
    "country": "مصر",
    "stream_url": "http://9090streaming.mobtada.com/9090FMEGYPT",
    "logo": "",
    "category": "مصر",
    "enabled": true
  },
  {
    "id": "station_68",
    "name": "NRJ مصر",
    "city": "الإسكندرية",
    "country": "مصر",
    "stream_url": "https://nrjstreaming.ahmed-melege.com/nrjegypt",
    "logo": "",
    "category": "مصر",
    "enabled": true
  },
  {
    "id": "station_69",
    "name": "On Sport FM",
    "city": "الإسكندرية",
    "country": "مصر",
    "stream_url": "https://carina.streamerr.co:2020/stream/OnSportFM",
    "logo": "",
    "category": "مصر",
    "enabled": true
  },
  {
    "id": "station_70",
    "name": "شعبي اف ام",
    "city": "الإسكندرية",
    "country": "مصر",
    "stream_url": "https://radio95.radioca.st/;",
    "logo": "",
    "category": "مصر",
    "enabled": true
  },
  {
    "id": "station_71",
    "name": "نجوم إف إم",
    "city": "الإسكندرية",
    "country": "مصر",
    "stream_url": "https://audio.nrpstream.com/listen/nogoumfm/radio.mp3",
    "logo": "",
    "category": "مصر",
    "enabled": true
  },
  {
    "id": "station_72",
    "name": "Nile FM",
    "city": "الإسكندرية",
    "country": "مصر",
    "stream_url": "https://ice23.securenetsystems.net/NILE",
    "logo": "",
    "category": "مصر",
    "enabled": true
  },
  {
    "id": "station_73",
    "name": "راديو نغم إف إم",
    "city": "الإسكندرية",
    "country": "مصر",
    "stream_url": "https://ahmsamir.radioca.st/stream",
    "logo": "",
    "category": "مصر",
    "enabled": true
  },
  {
    "id": "station_74",
    "name": "بي بي سي عربي",
    "city": "الإسكندرية",
    "country": "مصر",
    "stream_url": "https://stream.live.vc.bbcmedia.co.uk/bbc_arabic_radio",
    "logo": "",
    "category": "مصر",
    "enabled": true
  },
  {
    "id": "station_75",
    "name": "BBC World Sevice",
    "city": "الإسكندرية",
    "country": "مصر",
    "stream_url": "https://stream.live.vc.bbcmedia.co.uk/bbc_world_service",
    "logo": "",
    "category": "مصر",
    "enabled": true
  },
  {
    "id": "station_76",
    "name": "إذاعة القران الكريم",
    "city": "الأقصر",
    "country": "مصر",
    "stream_url": "http://stream.radiojar.com/8s5u5tpdtwzuv",
    "logo": "",
    "category": "مصر",
    "enabled": true
  },
  {
    "id": "station_77",
    "name": "إذاعة القرأن الكريم",
    "city": "الأقصر",
    "country": "مصر",
    "stream_url": "https://live.kwikmotion.com/sbrksaquranradiolive/ksaquranradio/playlist.m3u8",
    "logo": "",
    "category": "مصر",
    "enabled": true
  },
  {
    "id": "station_78",
    "name": "إذاعة الرياض",
    "city": "الأقصر",
    "country": "مصر",
    "stream_url": "https://live.kwikmotion.com/sbrksariyadhradiolive/ksariyadhradio/playlist.m3u8",
    "logo": "",
    "category": "مصر",
    "enabled": true
  },
  {
    "id": "station_79",
    "name": "إذاعة القران الكريم",
    "city": "أسوان",
    "country": "مصر",
    "stream_url": "http://stream.radiojar.com/8s5u5tpdtwzuv",
    "logo": "",
    "category": "مصر",
    "enabled": true
  },
  {
    "id": "station_80",
    "name": "إذاعة الرياض",
    "city": "أسوان",
    "country": "مصر",
    "stream_url": "https://live.kwikmotion.com/sbrksariyadhradiolive/ksariyadhradio/playlist.m3u8",
    "logo": "",
    "category": "مصر",
    "enabled": true
  },
  {
    "id": "station_81",
    "name": "إذاعة القرأن الكريم",
    "city": "أسوان",
    "country": "مصر",
    "stream_url": "https://live.kwikmotion.com/sbrksaquranradiolive/ksaquranradio/playlist.m3u8",
    "logo": "",
    "category": "مصر",
    "enabled": true
  },
  {
    "id": "station_82",
    "name": "مونت كارلو الدولية",
    "city": "بغداد",
    "country": "العراق",
    "stream_url": "https://montecarlodoualiya128k.ice.infomaniak.ch/mc-doualiya.mp3",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_83",
    "name": "بانوراما FM",
    "city": "بغداد",
    "country": "العراق",
    "stream_url": "https://shls-panoramafm-prod-dub.shahid.net/out/v1/66262e420d824475aaae794dc2d69f14/index.m3u8",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_84",
    "name": "إذاعة دار السلام",
    "city": "بغداد",
    "country": "العراق",
    "stream_url": "https://streams.radio.co/s0975ec186/listen",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_85",
    "name": "راديو الرشيد FM (بغداد)",
    "city": "بغداد",
    "country": "العراق",
    "stream_url": "https://streaming.shoutcast.com/alrasheed-fm",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_86",
    "name": "اذاعة المدى",
    "city": "بغداد",
    "country": "العراق",
    "stream_url": "https://fastcast4u.com/player/almadaradio",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_87",
    "name": "إذاعة صوت العراق",
    "city": "بغداد",
    "country": "العراق",
    "stream_url": "https://s2.radio.co/s92939c19b/listen",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_88",
    "name": "اذاعة الروضة الحسينية المقدسة",
    "city": "بغداد",
    "country": "العراق",
    "stream_url": "http://212.32.243.102:1935/live/fm/playlist.m3u8",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_89",
    "name": "إذاعة البلاد",
    "city": "بغداد",
    "country": "العراق",
    "stream_url": "https://streamer.radio.co/sb38bf6e66/listen",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_90",
    "name": "إذاعة صوت الخليج",
    "city": "بغداد",
    "country": "العراق",
    "stream_url": "http://ruby.streamguys.com:8120/sar-qatar-2",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_91",
    "name": "راديو الرشيد FM (بغداد)",
    "city": "بغداد",
    "country": "العراق",
    "stream_url": "https://streaming.shoutcast.com/alrasheed-fm",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_92",
    "name": "One FM",
    "city": "بغداد",
    "country": "العراق",
    "stream_url": "https://s2.radio.co/s03d947c9d/listen",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_93",
    "name": "BBC World Service",
    "city": "بغداد",
    "country": "العراق",
    "stream_url": "https://stream.live.vc.bbcmedia.co.uk/bbc_world_service",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_94",
    "name": "راديو سومر FM",
    "city": "بغداد",
    "country": "العراق",
    "stream_url": "https://l3.itworkscdn.net/itwaudio/9012/stream",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_95",
    "name": "التلفزيون العربي",
    "city": "بغداد",
    "country": "العراق",
    "stream_url": "https://l3.itworkscdn.net/alarabyradiolive/alarabyradio_audio/icecast.audio",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_96",
    "name": "اذاعة العهد الجديد المعمدانيه",
    "city": "بغداد",
    "country": "العراق",
    "stream_url": "https://s2.radio.co/s27b8c46f0/listen",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_97",
    "name": "اذاعة صوت الفرح",
    "city": "بغداد",
    "country": "العراق",
    "stream_url": "https://s2.radio.co/sae7326b67/listen",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_98",
    "name": "إذاعة الكويت البرنامج العام",
    "city": "بغداد",
    "country": "العراق",
    "stream_url": "https://kwtkrdota.cdn.mangomolo.com/k1rdo/k1rdo.stream_aac/index.m3u8",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_99",
    "name": "إذاعة الرياض",
    "city": "بغداد",
    "country": "العراق",
    "stream_url": "https://live.kwikmotion.com/sbrksariyadhradiolive/ksariyadhradio/playlist.m3u8",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_100",
    "name": "راديو فرهنگ",
    "city": "بغداد",
    "country": "العراق",
    "stream_url": "https://s1.cdn3.iranseda.ir/liveedge/radio-farhang/playlist.m3u8",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_101",
    "name": "اذاعة طهران العربية",
    "city": "بغداد",
    "country": "العراق",
    "stream_url": "https://s2.cdn1.iranseda.ir/liveedge/radio-arabic/playlist.m3u8",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_102",
    "name": "رادیو کرمانشاه",
    "city": "بغداد",
    "country": "العراق",
    "stream_url": "https://s1.cdn3.iranseda.ir/liveedgeprovincial/radio-kermanshah/playlist.m3u8",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_103",
    "name": "إذاعة القرآن الكريم",
    "city": "بغداد",
    "country": "العراق",
    "stream_url": "https://live.kwikmotion.com/sbrksaquranradiolive/ksaquranradio/playlist.m3u8",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_104",
    "name": "رادیو ایلام",
    "city": "بغداد",
    "country": "العراق",
    "stream_url": "https://s1.cdn3.iranseda.ir/liveedgeprovincial/radio-ilam/playlist.m3u8",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_105",
    "name": "رادیو فردا",
    "city": "بغداد",
    "country": "العراق",
    "stream_url": "https://stream.radiojar.com/cp13r2cpn3quv",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_106",
    "name": "رادیو جوان",
    "city": "البصرة",
    "country": "العراق",
    "stream_url": "https://s2.cdn3.iranseda.ir/liveedge/radio-javan/playlist.m3u8",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_107",
    "name": "رادیو ایران",
    "city": "البصرة",
    "country": "العراق",
    "stream_url": "https://s1.cdn3.iranseda.ir/liveedge/radio-iran/playlist.m3u8",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_108",
    "name": "راديو الرشيد FM (البصرة)",
    "city": "البصرة",
    "country": "العراق",
    "stream_url": "https://streaming.shoutcast.com/alrasheed-fm-basra",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_109",
    "name": "مونت كارلو الدولية",
    "city": "البصرة",
    "country": "العراق",
    "stream_url": "https://montecarlodoualiya128k.ice.infomaniak.ch/mc-doualiya.mp3",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_110",
    "name": "راديو ورزش",
    "city": "البصرة",
    "country": "العراق",
    "stream_url": "https://s2.cdn3.iranseda.ir/liveedge/radio-varzesh/playlist.m3u8",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_111",
    "name": "رادیو اقتصاد",
    "city": "البصرة",
    "country": "العراق",
    "stream_url": "https://s1.cdn3.iranseda.ir/liveedge/radio-eghtesad/playlist.m3u8",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_112",
    "name": "راديو آبادان",
    "city": "البصرة",
    "country": "العراق",
    "stream_url": "https://s1.cdn3.iranseda.ir/liveedgeprovincial/radio-abadan/playlist.m3u8",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_113",
    "name": "راديو معارف",
    "city": "البصرة",
    "country": "العراق",
    "stream_url": "http://altcdn.iranseda.ir:1935/channel-live/smil:r-maaref/playlist.m3u8",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_114",
    "name": "اذاعة طهران العربية",
    "city": "البصرة",
    "country": "العراق",
    "stream_url": "https://s2.cdn1.iranseda.ir/liveedge/radio-arabic/playlist.m3u8",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_115",
    "name": "راديو سومر FM",
    "city": "البصرة",
    "country": "العراق",
    "stream_url": "https://l3.itworkscdn.net/itwaudio/9012/stream",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_116",
    "name": "إذاعة صوت الخليج",
    "city": "البصرة",
    "country": "العراق",
    "stream_url": "http://ruby.streamguys.com:8120/sar-qatar-2",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_117",
    "name": "التلفزيون العربي",
    "city": "البصرة",
    "country": "العراق",
    "stream_url": "https://l3.itworkscdn.net/alarabyradiolive/alarabyradio_audio/icecast.audio",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_118",
    "name": "راديو سلامت",
    "city": "البصرة",
    "country": "العراق",
    "stream_url": "https://s2.cdn3.iranseda.ir/liveedge/radio-salamat/playlist.m3u8",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_119",
    "name": "إذاعة الكفيل",
    "city": "البصرة",
    "country": "العراق",
    "stream_url": "https://stream.alkafeel.net/live/radio/playlist.m3u8",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_120",
    "name": "اذاعة العهد الجديد المعمدانيه",
    "city": "البصرة",
    "country": "العراق",
    "stream_url": "https://s2.radio.co/s27b8c46f0/listen",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_121",
    "name": "اذاعة الروضة الحسينية المقدسة",
    "city": "البصرة",
    "country": "العراق",
    "stream_url": "http://212.32.243.102:1935/live/fm/playlist.m3u8",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_122",
    "name": "اذاعة المدى",
    "city": "البصرة",
    "country": "العراق",
    "stream_url": "https://fastcast4u.com/player/almadaradio",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_123",
    "name": "راديو پيام",
    "city": "البصرة",
    "country": "العراق",
    "stream_url": "https://s2.cdn3.iranseda.ir/liveedge/radio-payam/playlist.m3u8",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_124",
    "name": "إذاعة صوت النجباء",
    "city": "البصرة",
    "country": "العراق",
    "stream_url": "https://radio.al7eah.net/8022/stream",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_125",
    "name": "راديو فرهنگ",
    "city": "البصرة",
    "country": "العراق",
    "stream_url": "https://s1.cdn3.iranseda.ir/liveedge/radio-farhang/playlist.m3u8",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_126",
    "name": "رادیو قرآن",
    "city": "البصرة",
    "country": "العراق",
    "stream_url": "https://s2.cdn3.iranseda.ir/liveedge/radio-quran/playlist.m3u8",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_127",
    "name": "إذاعة الكويت البرنامج العام",
    "city": "البصرة",
    "country": "العراق",
    "stream_url": "https://kwtkrdota.cdn.mangomolo.com/k1rdo/k1rdo.stream_aac/index.m3u8",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_128",
    "name": "رادیو خوزستان",
    "city": "البصرة",
    "country": "العراق",
    "stream_url": "https://s1.cdn3.iranseda.ir/liveedgeprovincial/radio-khoozestan/playlist.m3u8",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_129",
    "name": "إذاعة نداء الإسلام",
    "city": "البصرة",
    "country": "العراق",
    "stream_url": "https://live.kwikmotion.com/sbrksanedaradiolive/ksanedaradio/playlist.m3u8",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_130",
    "name": "إذاعة القرآن الكريم",
    "city": "البصرة",
    "country": "العراق",
    "stream_url": "https://live.kwikmotion.com/sbrksaquranradiolive/ksaquranradio/playlist.m3u8",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_131",
    "name": "إذاعة جدة",
    "city": "البصرة",
    "country": "العراق",
    "stream_url": "https://live.kwikmotion.com/sbrksajeddahradiolive/ksajeddahradio/playlist.m3u8",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_132",
    "name": "إذاعة الرياض",
    "city": "البصرة",
    "country": "العراق",
    "stream_url": "https://live.kwikmotion.com/sbrksariyadhradiolive/ksariyadhradio/playlist.m3u8",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_133",
    "name": "محطة الغناء العربي القديم",
    "city": "البصرة",
    "country": "العراق",
    "stream_url": "https://kwtkrdota.cdn.mangomolo.com/olrdo/olrdo.stream_aac/chunklist.m3u8",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_134",
    "name": "إذاعة الكويت البرنامج الثاني",
    "city": "البصرة",
    "country": "العراق",
    "stream_url": "https://kwtkrdota.cdn.mangomolo.com/k2rdo/k2rdo.stream_aac/chunklist.m3u8",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_135",
    "name": "رادیو فردا",
    "city": "البصرة",
    "country": "العراق",
    "stream_url": "https://stream.radiojar.com/cp13r2cpn3quv",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_136",
    "name": "راديو سومر FM",
    "city": "أربيل / وێستگەی ڕادیۆیی لە ھەولێر",
    "country": "العراق",
    "stream_url": "https://l3.itworkscdn.net/itwaudio/9012/stream",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_137",
    "name": "اذاعة المدى",
    "city": "أربيل / وێستگەی ڕادیۆیی لە ھەولێر",
    "country": "العراق",
    "stream_url": "https://fastcast4u.com/player/almadaradio",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_138",
    "name": "مونت كارلو الدولية",
    "city": "أربيل / وێستگەی ڕادیۆیی لە ھەولێر",
    "country": "العراق",
    "stream_url": "https://montecarlodoualiya128k.ice.infomaniak.ch/mc-doualiya.mp3",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_139",
    "name": "رادیو ایران",
    "city": "أربيل / وێستگەی ڕادیۆیی لە ھەولێر",
    "country": "العراق",
    "stream_url": "https://s1.cdn3.iranseda.ir/liveedge/radio-iran/playlist.m3u8",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_140",
    "name": "راديو فرهنگ",
    "city": "أربيل / وێستگەی ڕادیۆیی لە ھەولێر",
    "country": "العراق",
    "stream_url": "https://s1.cdn3.iranseda.ir/liveedge/radio-farhang/playlist.m3u8",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_141",
    "name": "اذاعة طهران العربية",
    "city": "أربيل / وێستگەی ڕادیۆیی لە ھەولێر",
    "country": "العراق",
    "stream_url": "https://s2.cdn1.iranseda.ir/liveedge/radio-arabic/playlist.m3u8",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_142",
    "name": "رادیو ايران اينترنشنال",
    "city": "أربيل / وێستگەی ڕادیۆیی لە ھەولێر",
    "country": "العراق",
    "stream_url": "https://stream.radiojar.com/dfnrphnr5f0uv.mp3",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_143",
    "name": "رادیو ارومیه",
    "city": "أربيل / وێستگەی ڕادیۆیی لە ھەولێر",
    "country": "العراق",
    "stream_url": "https://s1.cdn3.iranseda.ir/liveedgeprovincial/radio-azgharbi/playlist.m3u8",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_144",
    "name": "Трансмировое радио",
    "city": "أربيل / وێستگەی ڕادیۆیی لە ھەولێر",
    "country": "العراق",
    "stream_url": "http://twrradio.ru:8000/listen",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_145",
    "name": "رادیو فردا",
    "city": "أربيل / وێستگەی ڕادیۆیی لە ھەولێر",
    "country": "العراق",
    "stream_url": "https://stream.radiojar.com/cp13r2cpn3quv",
    "logo": "",
    "category": "العراق",
    "enabled": true
  },
  {
    "id": "station_146",
    "name": "وتر ف.م",
    "city": "عمان",
    "country": "الأردن",
    "stream_url": "https://securestreams2.autopo.st:1243/live",
    "logo": "",
    "category": "الأردن",
    "enabled": true
  },
  {
    "id": "station_147",
    "name": "الاذاعة الاردنية",
    "city": "عمان",
    "country": "الأردن",
    "stream_url": "https://jrtv-live.ercdn.net/jrradio/jordanradio.m3u8",
    "logo": "",
    "category": "الأردن",
    "enabled": true
  },
  {
    "id": "station_148",
    "name": "Mood FM",
    "city": "عمان",
    "country": "الأردن",
    "stream_url": "https://securestreams2.autopo.st:1241/live",
    "logo": "",
    "category": "الأردن",
    "enabled": true
  },
  {
    "id": "station_149",
    "name": "راديو البلد",
    "city": "عمان",
    "country": "الأردن",
    "stream_url": "http://s3.voscast.com:8964/;stream.mp3",
    "logo": "",
    "category": "الأردن",
    "enabled": true
  },
  {
    "id": "station_150",
    "name": "اذاعة القران الكريم",
    "city": "عمان",
    "country": "الأردن",
    "stream_url": "https://jrtv-live.ercdn.net/jrradio/quranradio.m3u8",
    "logo": "",
    "category": "الأردن",
    "enabled": true
  },
  {
    "id": "station_151",
    "name": "حسنى اف ام",
    "city": "عمان",
    "country": "الأردن",
    "stream_url": "https://s2.voscast.com:10445/stream",
    "logo": "",
    "category": "الأردن",
    "enabled": true
  },
  {
    "id": "station_152",
    "name": "راديو دهب",
    "city": "عمان",
    "country": "الأردن",
    "stream_url": "http//dahab.ice.infomaniak.ch/dahab-192.mp3",
    "logo": "",
    "category": "الأردن",
    "enabled": true
  },
  {
    "id": "station_153",
    "name": "إذاعة الجامعة الأردنية",
    "city": "عمان",
    "country": "الأردن",
    "stream_url": "http://jufmstreaming.ju.edu.jo/;stream.mp3",
    "logo": "",
    "category": "الأردن",
    "enabled": true
  },
  {
    "id": "station_154",
    "name": "نجوم إف إم",
    "city": "عمان",
    "country": "الأردن",
    "stream_url": "https://audio.nrpstream.com/listen/nogoumfm/radio.mp3",
    "logo": "",
    "category": "الأردن",
    "enabled": true
  },
  {
    "id": "station_155",
    "name": "مونت كارلو الدولية",
    "city": "عمان",
    "country": "الأردن",
    "stream_url": "https://montecarlodoualiya128k.ice.infomaniak.ch/mc-doualiya.mp3",
    "logo": "",
    "category": "الأردن",
    "enabled": true
  },
  {
    "id": "station_156",
    "name": "راديو فرح الناس",
    "city": "عمان",
    "country": "الأردن",
    "stream_url": "http://stream.joinvisions.net:1935/farahlive/farahalnas/playlist.m3u8",
    "logo": "",
    "category": "الأردن",
    "enabled": true
  },
  {
    "id": "station_157",
    "name": "عمان اف ام",
    "city": "عمان",
    "country": "الأردن",
    "stream_url": "https://jrtv-live.ercdn.net/jrradio/ammanradio.m3u8",
    "logo": "",
    "category": "الأردن",
    "enabled": true
  },
  {
    "id": "station_158",
    "name": "Play 99.5",
    "city": "عمان",
    "country": "الأردن",
    "stream_url": "https://play995.radioca.st//stream",
    "logo": "",
    "category": "الأردن",
    "enabled": true
  },
  {
    "id": "station_159",
    "name": "راديو روتانا",
    "city": "عمان",
    "country": "الأردن",
    "stream_url": "http://188.247.86.66/RotanaRadio/Audio128/playlist.m3u8",
    "logo": "",
    "category": "الأردن",
    "enabled": true
  },
  {
    "id": "station_160",
    "name": "وطـــن إذاعة",
    "city": "عمان",
    "country": "الأردن",
    "stream_url": "http://46.43.64.50:8091/wattan",
    "logo": "",
    "category": "الأردن",
    "enabled": true
  },
  {
    "id": "station_161",
    "name": "صوت الغد",
    "city": "عمان",
    "country": "الأردن",
    "stream_url": "https://edge.mixlr.com/channel/oaoow",
    "logo": "",
    "category": "الأردن",
    "enabled": true
  },
  {
    "id": "station_162",
    "name": "Beat FM",
    "city": "عمان",
    "country": "الأردن",
    "stream_url": "https://securestreams2.autopo.st:1242/live",
    "logo": "",
    "category": "الأردن",
    "enabled": true
  },
  {
    "id": "station_163",
    "name": "اذاعة يقين",
    "city": "عمان",
    "country": "الأردن",
    "stream_url": "https://stream.zeno.fm/uzu059s00f8uv",
    "logo": "",
    "category": "الأردن",
    "enabled": true
  },
  {
    "id": "station_164",
    "name": "موقع حياة FM",
    "city": "عمان",
    "country": "الأردن",
    "stream_url": "https://dc1.serverse.com/proxy/kjxwtpdt/stream",
    "logo": "",
    "category": "الأردن",
    "enabled": true
  },
  {
    "id": "station_165",
    "name": "نشامى اف ام",
    "city": "عمان",
    "country": "الأردن",
    "stream_url": "https://nashama.radioca.st/stream",
    "logo": "",
    "category": "الأردن",
    "enabled": true
  },
  {
    "id": "station_166",
    "name": "بانوراما FM",
    "city": "عمان",
    "country": "الأردن",
    "stream_url": "https://shls-panoramafm-prod-dub.shahid.net/out/v1/66262e420d824475aaae794dc2d69f14/index.m3u8",
    "logo": "",
    "category": "الأردن",
    "enabled": true
  },
  {
    "id": "station_167",
    "name": "إذاعة الرياض",
    "city": "عمان",
    "country": "الأردن",
    "stream_url": "https://live.kwikmotion.com/sbrksariyadhradiolive/ksariyadhradio/playlist.m3u8",
    "logo": "",
    "category": "الأردن",
    "enabled": true
  },
  {
    "id": "station_168",
    "name": "بي بي سي عربي",
    "city": "عمان",
    "country": "الأردن",
    "stream_url": "https://stream.live.vc.bbcmedia.co.uk/bbc_arabic_radio",
    "logo": "",
    "category": "الأردن",
    "enabled": true
  },
  {
    "id": "station_169",
    "name": "BBC World Sevice",
    "city": "عمان",
    "country": "الأردن",
    "stream_url": "https://stream.live.vc.bbcmedia.co.uk/bbc_world_service",
    "logo": "",
    "category": "الأردن",
    "enabled": true
  },
  {
    "id": "station_170",
    "name": "יבנה",
    "city": "عمان",
    "country": "الأردن",
    "stream_url": "http://glzwizzlv.bynetcdn.com/glz_mp3",
    "logo": "",
    "category": "الأردن",
    "enabled": true
  },
  {
    "id": "station_171",
    "name": "رادیو جوان",
    "city": "مدينة الكويت",
    "country": "الكويت",
    "stream_url": "https://s2.cdn3.iranseda.ir/liveedge/radio-javan/playlist.m3u8",
    "logo": "",
    "category": "الكويت",
    "enabled": true
  },
  {
    "id": "station_172",
    "name": "محطة الغناء العربي القديم",
    "city": "مدينة الكويت",
    "country": "الكويت",
    "stream_url": "https://kwtkrdota.cdn.mangomolo.com/olrdo/olrdo.stream_aac/chunklist.m3u8",
    "logo": "",
    "category": "الكويت",
    "enabled": true
  },
  {
    "id": "station_173",
    "name": "محطة الدانة",
    "city": "مدينة الكويت",
    "country": "الكويت",
    "stream_url": "https://kwtkrdota.cdn.mangomolo.com/ofmrdo/ofmrdo.stream_aac/chunklist.m3u8",
    "logo": "",
    "category": "الكويت",
    "enabled": true
  },
  {
    "id": "station_174",
    "name": "إذاعة الكويت البرنامج العام",
    "city": "مدينة الكويت",
    "country": "الكويت",
    "stream_url": "https://kwtkrdota.cdn.mangomolo.com/k1rdo/k1rdo.stream_aac/index.m3u8",
    "logo": "",
    "category": "الكويت",
    "enabled": true
  },
  {
    "id": "station_175",
    "name": "رادیو ایران",
    "city": "مدينة الكويت",
    "country": "الكويت",
    "stream_url": "https://s1.cdn3.iranseda.ir/liveedge/radio-iran/playlist.m3u8",
    "logo": "",
    "category": "الكويت",
    "enabled": true
  },
  {
    "id": "station_176",
    "name": "راديو مارينا اف ام",
    "city": "مدينة الكويت",
    "country": "الكويت",
    "stream_url": "https://ffs3.gulfsat.com/MARINA-FM-904/tracks-a1/mono.ts.m3u8",
    "logo": "",
    "category": "الكويت",
    "enabled": true
  },
  {
    "id": "station_177",
    "name": "Easy FM",
    "city": "مدينة الكويت",
    "country": "الكويت",
    "stream_url": "https://kwtkrdota.cdn.mangomolo.com/eardo/eardo.stream_aac/chunklist.m3u8",
    "logo": "",
    "category": "الكويت",
    "enabled": true
  },
  {
    "id": "station_178",
    "name": "راديو ورزش",
    "city": "مدينة الكويت",
    "country": "الكويت",
    "stream_url": "https://s2.cdn3.iranseda.ir/liveedge/radio-varzesh/playlist.m3u8",
    "logo": "",
    "category": "الكويت",
    "enabled": true
  },
  {
    "id": "station_179",
    "name": "إذاعة الكويت البرنامج الثاني",
    "city": "مدينة الكويت",
    "country": "الكويت",
    "stream_url": "https://kwtkrdota.cdn.mangomolo.com/k2rdo/k2rdo.stream_aac/chunklist.m3u8",
    "logo": "",
    "category": "الكويت",
    "enabled": true
  },
  {
    "id": "station_180",
    "name": "محطة الذكر الحكيم",
    "city": "مدينة الكويت",
    "country": "الكويت",
    "stream_url": "https://kwtkrdota.cdn.mangomolo.com/daraerdo/daraerdo.stream_aac/chunklist.m3u8",
    "logo": "",
    "category": "الكويت",
    "enabled": true
  },
  {
    "id": "station_181",
    "name": "اذاعة طهران العربية",
    "city": "مدينة الكويت",
    "country": "الكويت",
    "stream_url": "https://s2.cdn1.iranseda.ir/liveedge/radio-arabic/playlist.m3u8",
    "logo": "",
    "category": "الكويت",
    "enabled": true
  },
  {
    "id": "station_182",
    "name": "إذاعة القرآن الكريم",
    "city": "مدينة الكويت",
    "country": "الكويت",
    "stream_url": "https://kwtkrdota.cdn.mangomolo.com/qrrdo/qrrdo.stream_aac/chunklist.m3u8",
    "logo": "",
    "category": "الكويت",
    "enabled": true
  },
  {
    "id": "station_183",
    "name": "أف أم سوبر ستيشن",
    "city": "مدينة الكويت",
    "country": "الكويت",
    "stream_url": "https://kwtkrdota.cdn.mangomolo.com/suprdo/suprdo.stream_aac/chunklist.m3u8",
    "logo": "",
    "category": "الكويت",
    "enabled": true
  },
  {
    "id": "station_184",
    "name": "BBC World Service",
    "city": "مدينة الكويت",
    "country": "الكويت",
    "stream_url": "https://stream.live.vc.bbcmedia.co.uk/bbc_world_service",
    "logo": "",
    "category": "الكويت",
    "enabled": true
  },
  {
    "id": "station_185",
    "name": "رادیو آوا",
    "city": "مدينة الكويت",
    "country": "الكويت",
    "stream_url": "https://s2.cdn3.iranseda.ir/liveedge/radio-avaa/playlist.m3u8",
    "logo": "",
    "category": "الكويت",
    "enabled": true
  },
  {
    "id": "station_186",
    "name": "إذاعة صوت الخليج",
    "city": "مدينة الكويت",
    "country": "الكويت",
    "stream_url": "http://ruby.streamguys.com:8120/sar-qatar-2",
    "logo": "",
    "category": "الكويت",
    "enabled": true
  },
  {
    "id": "station_187",
    "name": "كويت اف ام",
    "city": "مدينة الكويت",
    "country": "الكويت",
    "stream_url": "https://kwtkrdota.cdn.mangomolo.com/kfmrdo/kfmrdo.stream_aac/chunklist.m3u8",
    "logo": "",
    "category": "الكويت",
    "enabled": true
  },
  {
    "id": "station_188",
    "name": "راديو پيام",
    "city": "مدينة الكويت",
    "country": "الكويت",
    "stream_url": "https://s2.cdn3.iranseda.ir/liveedge/radio-payam/playlist.m3u8",
    "logo": "",
    "category": "الكويت",
    "enabled": true
  },
  {
    "id": "station_189",
    "name": "راديو فرهنگ",
    "city": "مدينة الكويت",
    "country": "الكويت",
    "stream_url": "https://s1.cdn3.iranseda.ir/liveedge/radio-farhang/playlist.m3u8",
    "logo": "",
    "category": "الكويت",
    "enabled": true
  },
  {
    "id": "station_190",
    "name": "مونت كارلو الدولية",
    "city": "مدينة الكويت",
    "country": "الكويت",
    "stream_url": "https://montecarlodoualiya128k.ice.infomaniak.ch/mc-doualiya.mp3",
    "logo": "",
    "category": "الكويت",
    "enabled": true
  },
  {
    "id": "station_191",
    "name": "رادیو قرآن",
    "city": "مدينة الكويت",
    "country": "الكويت",
    "stream_url": "https://s2.cdn3.iranseda.ir/liveedge/radio-quran/playlist.m3u8",
    "logo": "",
    "category": "الكويت",
    "enabled": true
  },
  {
    "id": "station_192",
    "name": "رادیو خوزستان",
    "city": "مدينة الكويت",
    "country": "الكويت",
    "stream_url": "https://s1.cdn3.iranseda.ir/liveedgeprovincial/radio-khoozestan/playlist.m3u8",
    "logo": "",
    "category": "الكويت",
    "enabled": true
  },
  {
    "id": "station_193",
    "name": "إذاعة قطر",
    "city": "مدينة الكويت",
    "country": "الكويت",
    "stream_url": "https://qmclivestreaming.qa/QRS/myStream/Playlist.m3u8",
    "logo": "",
    "category": "الكويت",
    "enabled": true
  },
  {
    "id": "station_194",
    "name": "إذاعة نداء الإسلام",
    "city": "مدينة الكويت",
    "country": "الكويت",
    "stream_url": "https://live.kwikmotion.com/sbrksanedaradiolive/ksanedaradio/playlist.m3u8",
    "logo": "",
    "category": "الكويت",
    "enabled": true
  },
  {
    "id": "station_195",
    "name": "إذاعة القرآن الكريم",
    "city": "مدينة الكويت",
    "country": "الكويت",
    "stream_url": "https://live.kwikmotion.com/sbrksaquranradiolive/ksaquranradio/playlist.m3u8",
    "logo": "",
    "category": "الكويت",
    "enabled": true
  },
  {
    "id": "station_196",
    "name": "إذاعة جدة",
    "city": "مدينة الكويت",
    "country": "الكويت",
    "stream_url": "https://live.kwikmotion.com/sbrksajeddahradiolive/ksajeddahradio/playlist.m3u8",
    "logo": "",
    "category": "الكويت",
    "enabled": true
  },
  {
    "id": "station_197",
    "name": "إذاعة الرياض",
    "city": "مدينة الكويت",
    "country": "الكويت",
    "stream_url": "https://live.kwikmotion.com/sbrksariyadhradiolive/ksariyadhradio/playlist.m3u8",
    "logo": "",
    "category": "الكويت",
    "enabled": true
  },
  {
    "id": "station_198",
    "name": "رادیو ‎بوشهر",
    "city": "مدينة الكويت",
    "country": "الكويت",
    "stream_url": "https://s1.cdn3.iranseda.ir/liveedgeprovincial/radio-bushehr/playlist.m3u8",
    "logo": "",
    "category": "الكويت",
    "enabled": true
  },
  {
    "id": "station_199",
    "name": "راديو آبادان",
    "city": "مدينة الكويت",
    "country": "الكويت",
    "stream_url": "https://s1.cdn3.iranseda.ir/liveedgeprovincial/radio-abadan/playlist.m3u8",
    "logo": "",
    "category": "الكويت",
    "enabled": true
  },
  {
    "id": "station_200",
    "name": "رادیو فردا",
    "city": "مدينة الكويت",
    "country": "الكويت",
    "stream_url": "https://stream.radiojar.com/cp13r2cpn3quv",
    "logo": "",
    "category": "الكويت",
    "enabled": true
  },
  {
    "id": "station_201",
    "name": "جبل لبنان",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "https://streaming.nrjaudio.fm/ousra9m4z85f",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_202",
    "name": "أغاني أغاني",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "https://streaming.nrjaudio.fm/ou6pfgxp336f",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_203",
    "name": "Nostalgie (Liban)",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "https://streaming.nrjaudio.fm/ouuc8n5n3nje",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_204",
    "name": "راديو ماريا (لبنان)",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "https://dreamsiteradiocp5.com/proxy/rmlebanon?mp=/stream",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_205",
    "name": "Light FM",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "https://playerservices.streamtheworld.com/api/livestream-redirect/LIGHTFM.mp3",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_206",
    "name": "إذاعة صوت الإنجيل",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "https://lit-cast.com/proxy/voiceofgospel?mp=/stream",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_207",
    "name": "إذاعة نداء المعرفة",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "https://nidaa.fm:8443/stream.mp3",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_208",
    "name": "إذاعة النور",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "https://l3.itworkscdn.net/itwaudio/9066/stream",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_209",
    "name": "إذاعة صوت الهدى",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "https://l3.itworkscdn.net/itwaudio/9032/stream",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_210",
    "name": "اذاعة صوت المدى",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "http://audiostreaming.itworkscdn.com:9018/;",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_211",
    "name": "اذاعة صوت كل لبنان",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "https://audio.osina.cloud:9323/stream",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_212",
    "name": "راديو سبوتنيك",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "https://icecast-rian.cdnvideo.ru/voicearb",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_213",
    "name": "إذاعة القرآن الكريم",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "https://audio.osina.cloud:7987/stream",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_214",
    "name": "راديو ماجيك لبنان",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "https://stream.zeno.fm/6amh0qc3mg8uv",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_215",
    "name": "Ռադիո Վանայ Ձայն",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "https://vovan.s3ming.com/vovan.mp3",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_216",
    "name": "إذاعة البشائر",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "https://l3.itworkscdn.net/itwaudio/9014/stream",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_217",
    "name": "صوت النجوم",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "https://radiozahle.net/proxy/rzoldies/;stream/1",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_218",
    "name": "صوت الغد",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "https://l3.itworkscdn.net/itwaudio/9030/stream",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_219",
    "name": "صوت النعمة",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "https://securestreams5.reliastream.com:1820/;",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_220",
    "name": "إذاعة لبنان",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "https://media2.streambrothers.com:2020/stream/8194",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_221",
    "name": "صوت لبنان 100.5",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "https://l3.itworkscdn.net/itwaudio/9054/stream",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_222",
    "name": "إذاعة الفجر",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "http://vps1.osina.cloud:9306/stream",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_223",
    "name": "Click FM",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "https://a12.my-control-panel.com:7530/radio.mp3",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_224",
    "name": "راديو دلتا",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "https://radiodelta.fm/mp3",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_225",
    "name": "إذاعة لبنان الحر",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "https://edge.mixlr.com/channel/qtqeb",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_226",
    "name": "صوت الشعب",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "https://audio.osina.cloud:9320/stream",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_227",
    "name": "Երտասարդութեան ձայն",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "https://cast5.asurahosting.com//proxy/jean/live",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_228",
    "name": "Mix FM",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "https://playerservices.streamtheworld.com/api/livestream-redirect/MIXFM_LEBANONAAC.aac",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_229",
    "name": "Belight FM",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "https://cast4.my-control-panel.com/proxy/radiode1/stream",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_230",
    "name": "اذاعة صوت المحبة",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "https://cast6.asurahosting.com/proxy/voiceofc/stream",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_231",
    "name": "TRT Radyo 1",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "https://trt.radyotvonline.net/trt1",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_232",
    "name": "TRT Çukurova Radyosu",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "https://radio-trtcukurova.medya.trt.com.tr/master.m3u8",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_233",
    "name": "عربي TRT",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "https://radio-trtarabi.medya.trt.com.tr/master.m3u8",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_234",
    "name": "بي بي سي عربي",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "https://stream.live.vc.bbcmedia.co.uk/bbc_arabic_radio",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_235",
    "name": "BBC World Sevice",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "https://stream.live.vc.bbcmedia.co.uk/bbc_world_service",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_236",
    "name": "יבנה",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "http://glzwizzlv.bynetcdn.com/glz_mp3",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_237",
    "name": "LBI Zaman",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "https://lbizaman-lbnet2.radioca.st/stream",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_238",
    "name": "LBI Hits",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "https://lbihits-lbnet2.radioca.st/stream",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_239",
    "name": "LBI Oldies",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "https://lbioldies-lbnet2.radioca.st/stream",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_240",
    "name": "Первое радио",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "https://s6.voscast.com:7753/stream",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_241",
    "name": "راديو الأرثوذكسية",
    "city": "بيروت",
    "country": "لبنان",
    "stream_url": "http://s5.viastreaming.net:7040/;",
    "logo": "",
    "category": "لبنان",
    "enabled": true
  },
  {
    "id": "station_242",
    "name": "راديو التناصح FM",
    "city": "طرابلس",
    "country": "ليبيا",
    "stream_url": "https://tanasuh.tv:8081/hls/fm.m3u8",
    "logo": "",
    "category": "ليبيا",
    "enabled": true
  },
  {
    "id": "station_243",
    "name": "راديو الوسط",
    "city": "طرابلس",
    "country": "ليبيا",
    "stream_url": "https://s3.radio.co/scb106c3a5/listen",
    "logo": "",
    "category": "ليبيا",
    "enabled": true
  },
  {
    "id": "station_244",
    "name": "إذاعة طريق السلف",
    "city": "طرابلس",
    "country": "ليبيا",
    "stream_url": "https://airtime.salafwayfm.ly",
    "logo": "",
    "category": "ليبيا",
    "enabled": true
  },
  {
    "id": "station_245",
    "name": "راديو دو إف إم",
    "city": "طرابلس",
    "country": "ليبيا",
    "stream_url": "http://live.dofm.ly:8000/stream.mp3",
    "logo": "",
    "category": "ليبيا",
    "enabled": true
  },
  {
    "id": "station_246",
    "name": "Nass FM",
    "city": "طرابلس",
    "country": "ليبيا",
    "stream_url": "https://s4.radio.co/s69a508e3f/listen",
    "logo": "",
    "category": "ليبيا",
    "enabled": true
  },
  {
    "id": "station_247",
    "name": "مونت كارلو الدولية",
    "city": "طرابلس",
    "country": "ليبيا",
    "stream_url": "https://montecarlodoualiya128k.ice.infomaniak.ch/mc-doualiya.mp3",
    "logo": "",
    "category": "ليبيا",
    "enabled": true
  },
  {
    "id": "station_248",
    "name": "الإذاعة الجزائرية - Jil FM",
    "city": "طرابلس",
    "country": "ليبيا",
    "stream_url": "https://webradio.tda.dz/Jeunesse_64K.mp3",
    "logo": "",
    "category": "ليبيا",
    "enabled": true
  },
  {
    "id": "station_249",
    "name": "الإذاعة الوطنية التونسية",
    "city": "طرابلس",
    "country": "ليبيا",
    "stream_url": "http://rtstream.tanitweb.com/nationale",
    "logo": "",
    "category": "ليبيا",
    "enabled": true
  },
  {
    "id": "station_250",
    "name": "مونت كارلو الدولية",
    "city": "نواكشوط",
    "country": "موريتانيا",
    "stream_url": "https://montecarlodoualiya128k.ice.infomaniak.ch/mc-doualiya.mp3",
    "logo": "",
    "category": "موريتانيا",
    "enabled": true
  },
  {
    "id": "station_251",
    "name": "إذاعة موريتانيا",
    "city": "نواكشوط",
    "country": "موريتانيا",
    "stream_url": "https://radiomauritaniechaine1.ice.infomaniak.ch/radiomauritaniechaine1.aac",
    "logo": "",
    "category": "موريتانيا",
    "enabled": true
  },
  {
    "id": "station_252",
    "name": "قناة اﻟﺠﺰﻳﺮﺓ",
    "city": "نواكشوط",
    "country": "موريتانيا",
    "stream_url": "https://live-hls-audio-web-aja.getaj.net/VOICE-AJA/index.m3u8",
    "logo": "",
    "category": "موريتانيا",
    "enabled": true
  },
  {
    "id": "station_253",
    "name": "إذاعـة القرآن الكريم",
    "city": "نواكشوط",
    "country": "موريتانيا",
    "stream_url": "http://radiocoran.ice.infomaniak.ch/radiocoran.aac",
    "logo": "",
    "category": "موريتانيا",
    "enabled": true
  },
  {
    "id": "station_254",
    "name": "Medi 1 radio",
    "city": "نواكشوط",
    "country": "موريتانيا",
    "stream_url": "https://live.medi1.com/medi1#.mp3",
    "logo": "",
    "category": "موريتانيا",
    "enabled": true
  },
  {
    "id": "station_255",
    "name": "RFI Afrique",
    "city": "نواكشوط",
    "country": "موريتانيا",
    "stream_url": "https://rfiafrique64k.ice.infomaniak.ch/rfiafrique-64.mp3",
    "logo": "",
    "category": "موريتانيا",
    "enabled": true
  },
  {
    "id": "station_256",
    "name": "الإذاعة الأمازيغية",
    "city": "الرباط / Stations de radio à Rabat",
    "country": "المغرب",
    "stream_url": "https://cdnamd-hls-globecast.akamaized.net/live/ramdisk/radio_amazigh/hls_snrt_radio/index.m3u8",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_257",
    "name": "SNRT Chaîne Inter",
    "city": "الرباط / Stations de radio à Rabat",
    "country": "المغرب",
    "stream_url": "https://cdnamd-hls-globecast.akamaized.net/live/ramdisk/radio_chaine_inter/hls_snrt_radio/index.m3u8",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_258",
    "name": "ميد راديو",
    "city": "الرباط / Stations de radio à Rabat",
    "country": "المغرب",
    "stream_url": "https://medradio.ice.infomaniak.ch/medradio-128.mp3",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_259",
    "name": "الإذاعة الوطنية المغربية",
    "city": "الرباط / Stations de radio à Rabat",
    "country": "المغرب",
    "stream_url": "https://cdnamd-hls-globecast.akamaized.net/live/ramdisk/radio_idaa_watanya/hls_snrt_radio/index.m3u8",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_260",
    "name": "إذاعة محمد السادس للقرآن الكريم",
    "city": "الرباط / Stations de radio à Rabat",
    "country": "المغرب",
    "stream_url": "https://cdnamd-hls-globecast.akamaized.net/live/ramdisk/radio_mohammed_6/hls_snrt_radio/index.m3u8",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_261",
    "name": "راديو أصوات",
    "city": "الرباط / Stations de radio à Rabat",
    "country": "المغرب",
    "stream_url": "https://broadcast.ice.infomaniak.ch/aswat-high.mp3",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_262",
    "name": "راديو مدينة اف ام",
    "city": "الرباط / Stations de radio à Rabat",
    "country": "المغرب",
    "stream_url": "http://medinafm.ice.infomaniak.ch/medinafm-64.mp3",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_263",
    "name": "Medi 1 radio",
    "city": "الرباط / Stations de radio à Rabat",
    "country": "المغرب",
    "stream_url": "https://live.medi1.com/medi1#.mp3",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_264",
    "name": "شدى FM",
    "city": "الرباط / Stations de radio à Rabat",
    "country": "المغرب",
    "stream_url": "https://chadafm.ice.infomaniak.ch/chadafm-high.mp3",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_265",
    "name": "الإذاعة الجزائرية - القناة الأولى",
    "city": "الرباط / Stations de radio à Rabat",
    "country": "المغرب",
    "stream_url": "https://webradio.tda.dz/Chaine1_64K.mp3",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_266",
    "name": "Medi 1 radio",
    "city": "الدار البيضاء / Stations de radio à Casablanca",
    "country": "المغرب",
    "stream_url": "https://live.medi1.com/medi1#.mp3",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_267",
    "name": "ميد راديو",
    "city": "الدار البيضاء / Stations de radio à Casablanca",
    "country": "المغرب",
    "stream_url": "https://medradio.ice.infomaniak.ch/medradio-128.mp3",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_268",
    "name": "SNRT Chaîne Inter",
    "city": "الدار البيضاء / Stations de radio à Casablanca",
    "country": "المغرب",
    "stream_url": "https://cdnamd-hls-globecast.akamaized.net/live/ramdisk/radio_chaine_inter/hls_snrt_radio/index.m3u8",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_269",
    "name": "الإذاعة الأمازيغية",
    "city": "الدار البيضاء / Stations de radio à Casablanca",
    "country": "المغرب",
    "stream_url": "https://cdnamd-hls-globecast.akamaized.net/live/ramdisk/radio_amazigh/hls_snrt_radio/index.m3u8",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_270",
    "name": "الإذاعة الوطنية المغربية",
    "city": "الدار البيضاء / Stations de radio à Casablanca",
    "country": "المغرب",
    "stream_url": "https://cdnamd-hls-globecast.akamaized.net/live/ramdisk/radio_idaa_watanya/hls_snrt_radio/index.m3u8",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_271",
    "name": "راديو مدينة اف ام",
    "city": "الدار البيضاء / Stations de radio à Casablanca",
    "country": "المغرب",
    "stream_url": "http://medinafm.ice.infomaniak.ch/medinafm-64.mp3",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_272",
    "name": "شدى FM",
    "city": "الدار البيضاء / Stations de radio à Casablanca",
    "country": "المغرب",
    "stream_url": "https://chadafm.ice.infomaniak.ch/chadafm-high.mp3",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_273",
    "name": "إذاعة محمد السادس للقرآن الكريم",
    "city": "الدار البيضاء / Stations de radio à Casablanca",
    "country": "المغرب",
    "stream_url": "https://cdnamd-hls-globecast.akamaized.net/live/ramdisk/radio_mohammed_6/hls_snrt_radio/index.m3u8",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_274",
    "name": "الإذاعة الجهوية للدار البيضاء",
    "city": "الدار البيضاء / Stations de radio à Casablanca",
    "country": "المغرب",
    "stream_url": "https://cdnamd-hls-globecast.akamaized.net/live/ramdisk/radio_casa/hls_snrt_radio/index.m3u8",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_275",
    "name": "راديو أصوات",
    "city": "الدار البيضاء / Stations de radio à Casablanca",
    "country": "المغرب",
    "stream_url": "https://broadcast.ice.infomaniak.ch/aswat-high.mp3",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_276",
    "name": "الإذاعة الجزائرية - القناة الأولى",
    "city": "الدار البيضاء / Stations de radio à Casablanca",
    "country": "المغرب",
    "stream_url": "https://webradio.tda.dz/Chaine1_64K.mp3",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_277",
    "name": "Achkid FM",
    "city": "الدار البيضاء / Stations de radio à Casablanca",
    "country": "المغرب",
    "stream_url": "https://stream.zeno.fm/7nqu31p6xg0uv",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_278",
    "name": "NRJ (Maroc)",
    "city": "الدار البيضاء / Stations de radio à Casablanca",
    "country": "المغرب",
    "stream_url": "https://icecast.nrjmaroc.com/stream",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_279",
    "name": "ميد راديو",
    "city": "فاس / Stations de radio à Fès",
    "country": "المغرب",
    "stream_url": "https://medradio.ice.infomaniak.ch/medradio-128.mp3",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_280",
    "name": "الإذاعة الوطنية المغربية",
    "city": "فاس / Stations de radio à Fès",
    "country": "المغرب",
    "stream_url": "https://cdnamd-hls-globecast.akamaized.net/live/ramdisk/radio_idaa_watanya/hls_snrt_radio/index.m3u8",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_281",
    "name": "شدى FM",
    "city": "فاس / Stations de radio à Fès",
    "country": "المغرب",
    "stream_url": "https://chadafm.ice.infomaniak.ch/chadafm-high.mp3",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_282",
    "name": "إذاعة محمد السادس للقرآن الكريم",
    "city": "فاس / Stations de radio à Fès",
    "country": "المغرب",
    "stream_url": "https://cdnamd-hls-globecast.akamaized.net/live/ramdisk/radio_mohammed_6/hls_snrt_radio/index.m3u8",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_283",
    "name": "إذاعة مكناس الجهوية",
    "city": "فاس / Stations de radio à Fès",
    "country": "المغرب",
    "stream_url": "https://cdnamd-hls-globecast.akamaized.net/live/ramdisk/radio_meknes/hls_snrt_radio/index.m3u8",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_284",
    "name": "راديو مدينة اف ام",
    "city": "فاس / Stations de radio à Fès",
    "country": "المغرب",
    "stream_url": "http://medinafm.ice.infomaniak.ch/medinafm-64.mp3",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_285",
    "name": "SNRT Chaîne Inter",
    "city": "فاس / Stations de radio à Fès",
    "country": "المغرب",
    "stream_url": "https://cdnamd-hls-globecast.akamaized.net/live/ramdisk/radio_chaine_inter/hls_snrt_radio/index.m3u8",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_286",
    "name": "راديو أصوات",
    "city": "فاس / Stations de radio à Fès",
    "country": "المغرب",
    "stream_url": "https://broadcast.ice.infomaniak.ch/aswat-high.mp3",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_287",
    "name": "الإذاعة الأمازيغية",
    "city": "فاس / Stations de radio à Fès",
    "country": "المغرب",
    "stream_url": "https://cdnamd-hls-globecast.akamaized.net/live/ramdisk/radio_amazigh/hls_snrt_radio/index.m3u8",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_288",
    "name": "إذاعة فاس الجهوية",
    "city": "فاس / Stations de radio à Fès",
    "country": "المغرب",
    "stream_url": "https://cdnamd-hls-globecast.akamaized.net/live/ramdisk/radio_fes/hls_snrt_radio/index.m3u8",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_289",
    "name": "Medi 1 radio",
    "city": "فاس / Stations de radio à Fès",
    "country": "المغرب",
    "stream_url": "https://live.medi1.com/medi1#.mp3",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_290",
    "name": "الإذاعة الجزائرية - القناة الأولى",
    "city": "فاس / Stations de radio à Fès",
    "country": "المغرب",
    "stream_url": "https://webradio.tda.dz/Chaine1_64K.mp3",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_291",
    "name": "الإذاعة الجزائرية - Jil FM",
    "city": "فاس / Stations de radio à Fès",
    "country": "المغرب",
    "stream_url": "https://webradio.tda.dz/Jeunesse_64K.mp3",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_292",
    "name": "إذاعة محمد السادس للقرآن الكريم",
    "city": "مراكش / Stations de radio à Marrakech",
    "country": "المغرب",
    "stream_url": "https://cdnamd-hls-globecast.akamaized.net/live/ramdisk/radio_mohammed_6/hls_snrt_radio/index.m3u8",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_293",
    "name": "ميد راديو",
    "city": "مراكش / Stations de radio à Marrakech",
    "country": "المغرب",
    "stream_url": "https://medradio.ice.infomaniak.ch/medradio-128.mp3",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_294",
    "name": "الإذاعة الأمازيغية",
    "city": "مراكش / Stations de radio à Marrakech",
    "country": "المغرب",
    "stream_url": "https://cdnamd-hls-globecast.akamaized.net/live/ramdisk/radio_amazigh/hls_snrt_radio/index.m3u8",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_295",
    "name": "إذاعة مراكش الجهوية",
    "city": "مراكش / Stations de radio à Marrakech",
    "country": "المغرب",
    "stream_url": "https://cdnamd-hls-globecast.akamaized.net/live/ramdisk/radio_marrakech/hls_snrt_radio/index.m3u8",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_296",
    "name": "الإذاعة الوطنية المغربية",
    "city": "مراكش / Stations de radio à Marrakech",
    "country": "المغرب",
    "stream_url": "https://cdnamd-hls-globecast.akamaized.net/live/ramdisk/radio_idaa_watanya/hls_snrt_radio/index.m3u8",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_297",
    "name": "شدى FM",
    "city": "مراكش / Stations de radio à Marrakech",
    "country": "المغرب",
    "stream_url": "https://chadafm.ice.infomaniak.ch/chadafm-high.mp3",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_298",
    "name": "SNRT Chaîne Inter",
    "city": "مراكش / Stations de radio à Marrakech",
    "country": "المغرب",
    "stream_url": "https://cdnamd-hls-globecast.akamaized.net/live/ramdisk/radio_chaine_inter/hls_snrt_radio/index.m3u8",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_299",
    "name": "راديو مدينة اف ام",
    "city": "مراكش / Stations de radio à Marrakech",
    "country": "المغرب",
    "stream_url": "http://medinafm.ice.infomaniak.ch/medinafm-64.mp3",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_300",
    "name": "راديو أصوات",
    "city": "مراكش / Stations de radio à Marrakech",
    "country": "المغرب",
    "stream_url": "https://broadcast.ice.infomaniak.ch/aswat-high.mp3",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_301",
    "name": "Medi 1 radio",
    "city": "مراكش / Stations de radio à Marrakech",
    "country": "المغرب",
    "stream_url": "https://live.medi1.com/medi1#.mp3",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_302",
    "name": "الإذاعة الجزائرية - القناة الأولى",
    "city": "مراكش / Stations de radio à Marrakech",
    "country": "المغرب",
    "stream_url": "https://webradio.tda.dz/Chaine1_64K.mp3",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_303",
    "name": "الإذاعة الوطنية المغربية",
    "city": "طنجة / Stations de radio à Tanger",
    "country": "المغرب",
    "stream_url": "https://cdnamd-hls-globecast.akamaized.net/live/ramdisk/radio_idaa_watanya/hls_snrt_radio/index.m3u8",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_304",
    "name": "إذاعة محمد السادس للقرآن الكريم",
    "city": "طنجة / Stations de radio à Tanger",
    "country": "المغرب",
    "stream_url": "https://cdnamd-hls-globecast.akamaized.net/live/ramdisk/radio_mohammed_6/hls_snrt_radio/index.m3u8",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_305",
    "name": "إذاعة طنجة الجهوية",
    "city": "طنجة / Stations de radio à Tanger",
    "country": "المغرب",
    "stream_url": "https://cdnamd-hls-globecast.akamaized.net/live/ramdisk/radio_tanger/hls_snrt_radio/index.m3u8",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_306",
    "name": "ميد راديو",
    "city": "طنجة / Stations de radio à Tanger",
    "country": "المغرب",
    "stream_url": "https://medradio.ice.infomaniak.ch/medradio-128.mp3",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_307",
    "name": "SNRT Chaîne Inter",
    "city": "طنجة / Stations de radio à Tanger",
    "country": "المغرب",
    "stream_url": "https://cdnamd-hls-globecast.akamaized.net/live/ramdisk/radio_chaine_inter/hls_snrt_radio/index.m3u8",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_308",
    "name": "راديو مدينة اف ام",
    "city": "طنجة / Stations de radio à Tanger",
    "country": "المغرب",
    "stream_url": "http://medinafm.ice.infomaniak.ch/medinafm-64.mp3",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_309",
    "name": "إذاعة تطوان الجهوية",
    "city": "طنجة / Stations de radio à Tanger",
    "country": "المغرب",
    "stream_url": "https://cdnamd-hls-globecast.akamaized.net/live/ramdisk/radio_tetouan/hls_snrt_radio/index.m3u8",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_310",
    "name": "شدى FM",
    "city": "طنجة / Stations de radio à Tanger",
    "country": "المغرب",
    "stream_url": "https://chadafm.ice.infomaniak.ch/chadafm-high.mp3",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_311",
    "name": "الإذاعة الأمازيغية",
    "city": "طنجة / Stations de radio à Tanger",
    "country": "المغرب",
    "stream_url": "https://cdnamd-hls-globecast.akamaized.net/live/ramdisk/radio_amazigh/hls_snrt_radio/index.m3u8",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_312",
    "name": "Medi 1 radio",
    "city": "طنجة / Stations de radio à Tanger",
    "country": "المغرب",
    "stream_url": "https://live.medi1.com/medi1#.mp3",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_313",
    "name": "BFBS Gibraltar",
    "city": "طنجة / Stations de radio à Tanger",
    "country": "المغرب",
    "stream_url": "https://listen-ssvcbfbs.sharp-stream.com/ssvcbfbs7.aac",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_314",
    "name": "راديو أصوات",
    "city": "طنجة / Stations de radio à Tanger",
    "country": "المغرب",
    "stream_url": "https://broadcast.ice.infomaniak.ch/aswat-high.mp3",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_315",
    "name": "الإذاعة الجزائرية - القناة الأولى",
    "city": "طنجة / Stations de radio à Tanger",
    "country": "المغرب",
    "stream_url": "https://webradio.tda.dz/Chaine1_64K.mp3",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_316",
    "name": "الإذاعة الجزائرية - Jil FM",
    "city": "طنجة / Stations de radio à Tanger",
    "country": "المغرب",
    "stream_url": "https://webradio.tda.dz/Jeunesse_64K.mp3",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_317",
    "name": "COPE Sevilla",
    "city": "طنجة / Stations de radio à Tanger",
    "country": "المغرب",
    "stream_url": "https://wecast-b03-01.flumotion.com/copesedes/sevilla.mp3",
    "logo": "",
    "category": "المغرب",
    "enabled": true
  },
  {
    "id": "station_318",
    "name": "إذاعة القرآن الكريم",
    "city": "مسقط",
    "country": "عُمان",
    "stream_url": "https://partwo.cdn.mgmlcdn.com/quranrdoorg/quranrdo.stream_aac/playlist.m3u8",
    "logo": "",
    "category": "عُمان",
    "enabled": true
  },
  {
    "id": "station_319",
    "name": "Oman FM",
    "city": "مسقط",
    "country": "عُمان",
    "stream_url": "https://partwo.cdn.mgmlcdn.com/omengrdoorg/omengrdo.stream_aac/chunklist.m3u8",
    "logo": "",
    "category": "عُمان",
    "enabled": true
  },
  {
    "id": "station_320",
    "name": "مونت كارلو الدولية",
    "city": "مسقط",
    "country": "عُمان",
    "stream_url": "https://montecarlodoualiya128k.ice.infomaniak.ch/mc-doualiya.mp3",
    "logo": "",
    "category": "عُمان",
    "enabled": true
  },
  {
    "id": "station_321",
    "name": "إذاعــة سلـطنة عمان",
    "city": "مسقط",
    "country": "عُمان",
    "stream_url": "https://partne.cdn.mgmlcdn.com/omanrdoorg/omanrdo.stream_aac/chunklist.m3u8",
    "logo": "",
    "category": "عُمان",
    "enabled": true
  },
  {
    "id": "station_322",
    "name": "إذاعة الصمود FM",
    "city": "مسقط",
    "country": "عُمان",
    "stream_url": "https://us3.internet-radio.com/proxy/alsumoodfm2020?mp=/stream",
    "logo": "",
    "category": "عُمان",
    "enabled": true
  },
  {
    "id": "station_323",
    "name": "إذاعة الوصال",
    "city": "مسقط",
    "country": "عُمان",
    "stream_url": "https://securestreams3.autopo.st:1380/stream",
    "logo": "",
    "category": "عُمان",
    "enabled": true
  },
  {
    "id": "station_324",
    "name": "الشبيبة أف إم",
    "city": "مسقط",
    "country": "عُمان",
    "stream_url": "https://stream.shabiba.fm:9010/shabiba",
    "logo": "",
    "category": "عُمان",
    "enabled": true
  },
  {
    "id": "station_325",
    "name": "إذاعة الشباب",
    "city": "مسقط",
    "country": "عُمان",
    "stream_url": "https://partne.cdn.mgmlcdn.com/shababrdoorg/shababrdo.stream_aac/playlist.m3u8",
    "logo": "",
    "category": "عُمان",
    "enabled": true
  },
  {
    "id": "station_326",
    "name": "هلا اف ام",
    "city": "مسقط",
    "country": "عُمان",
    "stream_url": "https://listen-halafm.sharp-stream.com/halafmmid.mp3",
    "logo": "",
    "category": "عُمان",
    "enabled": true
  },
  {
    "id": "station_327",
    "name": "BBC World Service",
    "city": "مسقط",
    "country": "عُمان",
    "stream_url": "https://stream.live.vc.bbcmedia.co.uk/bbc_world_service",
    "logo": "",
    "category": "عُمان",
    "enabled": true
  },
  {
    "id": "station_328",
    "name": "Merge 104.8",
    "city": "مسقط",
    "country": "عُمان",
    "stream_url": "http://uk7.internet-radio.com:8040/stream?icy=http",
    "logo": "",
    "category": "عُمان",
    "enabled": true
  },
  {
    "id": "station_329",
    "name": "إذاعة مسقط FM",
    "city": "مسقط",
    "country": "عُمان",
    "stream_url": "https://playoutonestreaming.com/proxy/muscatfm/?mp=/stream",
    "logo": "",
    "category": "عُمان",
    "enabled": true
  },
  {
    "id": "station_330",
    "name": "إذاعة صوت الخليج",
    "city": "مسقط",
    "country": "عُمان",
    "stream_url": "http://ruby.streamguys.com:8120/sar-qatar-2",
    "logo": "",
    "category": "عُمان",
    "enabled": true
  },
  {
    "id": "station_331",
    "name": "اذاعة طهران العربية",
    "city": "مسقط",
    "country": "عُمان",
    "stream_url": "https://s2.cdn1.iranseda.ir/liveedge/radio-arabic/playlist.m3u8",
    "logo": "",
    "category": "عُمان",
    "enabled": true
  },
  {
    "id": "station_332",
    "name": "رادیو سیستان و بلوچستان",
    "city": "مسقط",
    "country": "عُمان",
    "stream_url": "https://s1.cdn3.iranseda.ir/liveedgeprovincial/radio-zahedan/playlist.m3u8",
    "logo": "",
    "category": "عُمان",
    "enabled": true
  },
  {
    "id": "station_333",
    "name": "بی بی سی دری",
    "city": "مسقط",
    "country": "عُمان",
    "stream_url": "https://stream.live.vc.bbcmedia.co.uk/bbc_dari_radio",
    "logo": "",
    "category": "عُمان",
    "enabled": true
  },
  {
    "id": "station_334",
    "name": "بی بی سی پښتو",
    "city": "مسقط",
    "country": "عُمان",
    "stream_url": "https://stream.live.vc.bbcmedia.co.uk/bbc_pashto_radio",
    "logo": "",
    "category": "عُمان",
    "enabled": true
  },
  {
    "id": "station_335",
    "name": "כאן 88",
    "city": "رام الله",
    "country": "فلسطين",
    "stream_url": "https://playerservices.streamtheworld.com/api/livestream-redirect/KAN_88.mp3",
    "logo": "",
    "category": "فلسطين",
    "enabled": true
  },
  {
    "id": "station_336",
    "name": "راديو يبوس",
    "city": "رام الله",
    "country": "فلسطين",
    "stream_url": "https://stream.yaboos.fm/live",
    "logo": "",
    "category": "فلسطين",
    "enabled": true
  },
  {
    "id": "station_337",
    "name": "إذاعة القرآن الكريم نابلس",
    "city": "رام الله",
    "country": "فلسطين",
    "stream_url": "https://quran-radio.org:8443/;stream.mp3",
    "logo": "",
    "category": "فلسطين",
    "enabled": true
  },
  {
    "id": "station_338",
    "name": "مكان راديو",
    "city": "رام الله",
    "country": "فلسطين",
    "stream_url": "https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO_MAKAN.mp3",
    "logo": "",
    "category": "فلسطين",
    "enabled": true
  },
  {
    "id": "station_339",
    "name": "רדיו גלי ישראל",
    "city": "رام الله",
    "country": "فلسطين",
    "stream_url": "https://cdn.cybercdn.live/Galei_Israel/Live/icecast.audio",
    "logo": "",
    "category": "فلسطين",
    "enabled": true
  },
  {
    "id": "station_340",
    "name": "כאן גימל",
    "city": "رام الله",
    "country": "فلسطين",
    "stream_url": "https://playerservices.streamtheworld.com/api/livestream-redirect/KAN_GIMMEL.mp3",
    "logo": "",
    "category": "فلسطين",
    "enabled": true
  },
  {
    "id": "station_341",
    "name": "اذاعة صوت فلسطين",
    "city": "رام الله",
    "country": "فلسطين",
    "stream_url": "https://pbc.furrera.ps/voiceofpalestine/tracks-a1/mono.m3u8",
    "logo": "",
    "category": "فلسطين",
    "enabled": true
  },
  {
    "id": "station_342",
    "name": "الاذاعة الاردنية",
    "city": "رام الله",
    "country": "فلسطين",
    "stream_url": "https://jrtv-live.ercdn.net/jrradio/jordanradio.m3u8",
    "logo": "",
    "category": "فلسطين",
    "enabled": true
  },
  {
    "id": "station_343",
    "name": "כאן קול המוסיקה",
    "city": "رام الله",
    "country": "فلسطين",
    "stream_url": "https://playerservices.streamtheworld.com/api/livestream-redirect/KAN_KOL_HAMUSICA.mp3",
    "logo": "",
    "category": "فلسطين",
    "enabled": true
  },
  {
    "id": "station_344",
    "name": "רדיו גלגלצ",
    "city": "رام الله",
    "country": "فلسطين",
    "stream_url": "http://glzwizzlv.bynetcdn.com/glglz_mp3",
    "logo": "",
    "category": "فلسطين",
    "enabled": true
  },
  {
    "id": "station_345",
    "name": "כאן מורשת",
    "city": "رام الله",
    "country": "فلسطين",
    "stream_url": "https://playerservices.streamtheworld.com/api/livestream-redirect/KAN_MORESHET.mp3",
    "logo": "",
    "category": "فلسطين",
    "enabled": true
  },
  {
    "id": "station_346",
    "name": "רדיו קול חי",
    "city": "رام الله",
    "country": "فلسطين",
    "stream_url": "http://media.93fm.co.il/live",
    "logo": "",
    "category": "فلسطين",
    "enabled": true
  },
  {
    "id": "station_347",
    "name": "مونت كارلو الدولية",
    "city": "رام الله",
    "country": "فلسطين",
    "stream_url": "https://montecarlodoualiya128k.ice.infomaniak.ch/mc-doualiya.mp3",
    "logo": "",
    "category": "فلسطين",
    "enabled": true
  },
  {
    "id": "station_348",
    "name": "כאן ב",
    "city": "رام الله",
    "country": "فلسطين",
    "stream_url": "https://playerservices.streamtheworld.com/api/livestream-redirect/KAN_BET.mp3",
    "logo": "",
    "category": "فلسطين",
    "enabled": true
  },
  {
    "id": "station_349",
    "name": "إذاعة نساء إف إم",
    "city": "رام الله",
    "country": "فلسطين",
    "stream_url": "https://icecast.mada.ps:8498/stream",
    "logo": "",
    "category": "فلسطين",
    "enabled": true
  },
  {
    "id": "station_350",
    "name": "גלי צה\"ל",
    "city": "رام الله",
    "country": "فلسطين",
    "stream_url": "http://glzwizzlv.bynetcdn.com/glz_mp3",
    "logo": "",
    "category": "فلسطين",
    "enabled": true
  },
  {
    "id": "station_351",
    "name": "إذاعة 24FM",
    "city": "رام الله",
    "country": "فلسطين",
    "stream_url": "https://audio.callu.ps/24fm",
    "logo": "",
    "category": "فلسطين",
    "enabled": true
  },
  {
    "id": "station_352",
    "name": "КАН РЭКА",
    "city": "رام الله",
    "country": "فلسطين",
    "stream_url": "https://playerservices.streamtheworld.com/api/livestream-redirect/KAN_REKA.mp3",
    "logo": "",
    "category": "فلسطين",
    "enabled": true
  },
  {
    "id": "station_353",
    "name": "רדיו ירושלים",
    "city": "رام الله",
    "country": "فلسطين",
    "stream_url": "https://radio.streamgates.net/stream/101fm",
    "logo": "",
    "category": "فلسطين",
    "enabled": true
  },
  {
    "id": "station_354",
    "name": "راديو أجيال",
    "city": "رام الله",
    "country": "فلسطين",
    "stream_url": "https://icecast.mada.ps:8495/ajyalnewssl",
    "logo": "",
    "category": "فلسطين",
    "enabled": true
  },
  {
    "id": "station_355",
    "name": "رام الله اف ام",
    "city": "رام الله",
    "country": "فلسطين",
    "stream_url": "https://streamer.mada.ps:8206/radioramallah",
    "logo": "",
    "category": "فلسطين",
    "enabled": true
  },
  {
    "id": "station_356",
    "name": "Cool FM",
    "city": "رام الله",
    "country": "فلسطين",
    "stream_url": "http://streamer.mada.ps:8043/coolfm",
    "logo": "",
    "category": "فلسطين",
    "enabled": true
  },
  {
    "id": "station_357",
    "name": "כאן תרבות",
    "city": "رام الله",
    "country": "فلسطين",
    "stream_url": "https://playerservices.streamtheworld.com/api/livestream-redirect/KAN_TARBUT.mp3",
    "logo": "",
    "category": "فلسطين",
    "enabled": true
  },
  {
    "id": "station_358",
    "name": "רדיו קול ברמה",
    "city": "رام الله",
    "country": "فلسطين",
    "stream_url": "https://icy.streamgates.net/Radio_CDN/Kol_Barama/icecast.audio",
    "logo": "",
    "category": "فلسطين",
    "enabled": true
  },
  {
    "id": "station_359",
    "name": "Jerusalem 24",
    "city": "رام الله",
    "country": "فلسطين",
    "stream_url": "https://audio.callu.ps/24fmen",
    "logo": "",
    "category": "فلسطين",
    "enabled": true
  },
  {
    "id": "station_360",
    "name": "راديو مزايا",
    "city": "رام الله",
    "country": "فلسطين",
    "stream_url": "https://streaming.shoutcast.com/mazayafm",
    "logo": "",
    "category": "فلسطين",
    "enabled": true
  },
  {
    "id": "station_361",
    "name": "إذاعة الرياض",
    "city": "رام الله",
    "country": "فلسطين",
    "stream_url": "https://live.kwikmotion.com/sbrksariyadhradiolive/ksariyadhradio/playlist.m3u8",
    "logo": "",
    "category": "فلسطين",
    "enabled": true
  },
  {
    "id": "station_362",
    "name": "بي بي سي عربي",
    "city": "رام الله",
    "country": "فلسطين",
    "stream_url": "https://stream.live.vc.bbcmedia.co.uk/bbc_arabic_radio",
    "logo": "",
    "category": "فلسطين",
    "enabled": true
  },
  {
    "id": "station_363",
    "name": "BBC World Sevice",
    "city": "رام الله",
    "country": "فلسطين",
    "stream_url": "https://stream.live.vc.bbcmedia.co.uk/bbc_world_service",
    "logo": "",
    "category": "فلسطين",
    "enabled": true
  },
  {
    "id": "station_364",
    "name": "יבנה",
    "city": "رام الله",
    "country": "فلسطين",
    "stream_url": "http://glzwizzlv.bynetcdn.com/glz_mp3",
    "logo": "",
    "category": "فلسطين",
    "enabled": true
  },
  {
    "id": "station_365",
    "name": "إذاعة صوت الخليج",
    "city": "الدوحة",
    "country": "قطر",
    "stream_url": "http://ruby.streamguys.com:8120/sar-qatar-2",
    "logo": "",
    "category": "قطر",
    "enabled": true
  },
  {
    "id": "station_366",
    "name": "محطة الغناء العربي القديم",
    "city": "الدوحة",
    "country": "قطر",
    "stream_url": "https://kwtkrdota.cdn.mangomolo.com/olrdo/olrdo.stream_aac/chunklist.m3u8",
    "logo": "",
    "category": "قطر",
    "enabled": true
  },
  {
    "id": "station_367",
    "name": "إذاعة قطر",
    "city": "الدوحة",
    "country": "قطر",
    "stream_url": "https://qmclivestreaming.qa/QRS/myStream/Playlist.m3u8",
    "logo": "",
    "category": "قطر",
    "enabled": true
  },
  {
    "id": "station_368",
    "name": "Oryx FM",
    "city": "الدوحة",
    "country": "قطر",
    "stream_url": "https://qmclivestreaming.qa/ORYX/myStream/Playlist.m3u8",
    "logo": "",
    "category": "قطر",
    "enabled": true
  },
  {
    "id": "station_369",
    "name": "التلفزيون العربي",
    "city": "الدوحة",
    "country": "قطر",
    "stream_url": "https://l3.itworkscdn.net/alarabyradiolive/alarabyradio_audio/icecast.audio",
    "logo": "",
    "category": "قطر",
    "enabled": true
  },
  {
    "id": "station_370",
    "name": "مونت كارلو الدولية",
    "city": "الدوحة",
    "country": "قطر",
    "stream_url": "https://montecarlodoualiya128k.ice.infomaniak.ch/mc-doualiya.mp3",
    "logo": "",
    "category": "قطر",
    "enabled": true
  },
  {
    "id": "station_371",
    "name": "Fame FM",
    "city": "الدوحة",
    "country": "قطر",
    "stream_url": "https://playerservices.streamtheworld.com/api/livestream-redirect/SAM03AAC389.aac",
    "logo": "",
    "category": "قطر",
    "enabled": true
  },
  {
    "id": "station_372",
    "name": "Al Jazeera (English)",
    "city": "الدوحة",
    "country": "قطر",
    "stream_url": "https://live-hls-audio-aje-ak.getaj.net/VOICE-AJE/index.m3u8",
    "logo": "",
    "category": "قطر",
    "enabled": true
  },
  {
    "id": "station_373",
    "name": "قناة اﻟﺠﺰﻳﺮﺓ",
    "city": "الدوحة",
    "country": "قطر",
    "stream_url": "https://live-hls-audio-web-aja.getaj.net/VOICE-AJA/index.m3u8",
    "logo": "",
    "category": "قطر",
    "enabled": true
  },
  {
    "id": "station_374",
    "name": "إذاعة القرآن الكريم",
    "city": "الدوحة",
    "country": "قطر",
    "stream_url": "https://qmclivestreaming.qa/QURAN/myStream/Playlist.m3u8",
    "logo": "",
    "category": "قطر",
    "enabled": true
  },
  {
    "id": "station_375",
    "name": "إنت أف أم",
    "city": "الدوحة",
    "country": "قطر",
    "stream_url": "https://s4.radio.co/s907eaefbe/listen",
    "logo": "",
    "category": "قطر",
    "enabled": true
  },
  {
    "id": "station_376",
    "name": "إذاعة القرآن الكريم 2",
    "city": "الدوحة",
    "country": "قطر",
    "stream_url": "https://qmclivestreaming.qa/QURAN2/myStream/Playlist.m3u8",
    "logo": "",
    "category": "قطر",
    "enabled": true
  },
  {
    "id": "station_377",
    "name": "اردو ریڈیو",
    "city": "الدوحة",
    "country": "قطر",
    "stream_url": "https://qmclivestreaming.qa/URDU/myStream/Playlist.m3u8",
    "logo": "",
    "category": "قطر",
    "enabled": true
  },
  {
    "id": "station_378",
    "name": "إذاعة الكويت البرنامج العام",
    "city": "الدوحة",
    "country": "قطر",
    "stream_url": "https://kwtkrdota.cdn.mangomolo.com/k1rdo/k1rdo.stream_aac/index.m3u8",
    "logo": "",
    "category": "قطر",
    "enabled": true
  },
  {
    "id": "station_379",
    "name": "رادیو ایران",
    "city": "الدوحة",
    "country": "قطر",
    "stream_url": "https://s1.cdn3.iranseda.ir/liveedge/radio-iran/playlist.m3u8",
    "logo": "",
    "category": "قطر",
    "enabled": true
  },
  {
    "id": "station_380",
    "name": "القرآن الكريم 106.1",
    "city": "الدوحة",
    "country": "قطر",
    "stream_url": "https://5c7b683162943.streamlock.net/live/ngrp:radio-106-1_all/playlist.m3u8",
    "logo": "",
    "category": "قطر",
    "enabled": true
  },
  {
    "id": "station_381",
    "name": "رادیو فارس",
    "city": "الدوحة",
    "country": "قطر",
    "stream_url": "https://s1.cdn3.iranseda.ir/liveedgeprovincial/radio-fars/playlist.m3u8",
    "logo": "",
    "category": "قطر",
    "enabled": true
  },
  {
    "id": "station_382",
    "name": "رادیو ‎بوشهر",
    "city": "الدوحة",
    "country": "قطر",
    "stream_url": "https://s1.cdn3.iranseda.ir/liveedgeprovincial/radio-bushehr/playlist.m3u8",
    "logo": "",
    "category": "قطر",
    "enabled": true
  },
  {
    "id": "station_383",
    "name": "بحرين راديو 102.3",
    "city": "الدوحة",
    "country": "قطر",
    "stream_url": "https://5c7b683162943.streamlock.net/live/ngrp:radio-102-3_all/playlist.m3u8",
    "logo": "",
    "category": "قطر",
    "enabled": true
  },
  {
    "id": "station_384",
    "name": "إذاعة جدة",
    "city": "الدوحة",
    "country": "قطر",
    "stream_url": "https://live.kwikmotion.com/sbrksajeddahradiolive/ksajeddahradio/playlist.m3u8",
    "logo": "",
    "category": "قطر",
    "enabled": true
  },
  {
    "id": "station_385",
    "name": "اذاعة طهران العربية",
    "city": "الدوحة",
    "country": "قطر",
    "stream_url": "https://s2.cdn1.iranseda.ir/liveedge/radio-arabic/playlist.m3u8",
    "logo": "",
    "category": "قطر",
    "enabled": true
  },
  {
    "id": "station_386",
    "name": "إذاعة الرياض",
    "city": "الدوحة",
    "country": "قطر",
    "stream_url": "https://live.kwikmotion.com/sbrksariyadhradiolive/ksariyadhradio/playlist.m3u8",
    "logo": "",
    "category": "قطر",
    "enabled": true
  },
  {
    "id": "station_387",
    "name": "رادیو فردا",
    "city": "الدوحة",
    "country": "قطر",
    "stream_url": "https://stream.radiojar.com/cp13r2cpn3quv",
    "logo": "",
    "category": "قطر",
    "enabled": true
  },
  {
    "id": "station_388",
    "name": "راديو UFM",
    "city": "الرياض",
    "country": "السعودية",
    "stream_url": "http://stream.ufmradio.com:8000/stream",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_389",
    "name": "إذاعة الرياض",
    "city": "الرياض",
    "country": "السعودية",
    "stream_url": "https://live.kwikmotion.com/sbrksariyadhradiolive/ksariyadhradio/playlist.m3u8",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_390",
    "name": "إذاعة الإخبارية",
    "city": "الرياض",
    "country": "السعودية",
    "stream_url": "https://live.kwikmotion.com/sbrksaikhbariyaradiolive/srpikhbariyaradio/playlist.m3u8",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_391",
    "name": "ألف ألف FM",
    "city": "الرياض",
    "country": "السعودية",
    "stream_url": "https://alifalifjobs.com/radio/8000/AlifAlifLive.mp3",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_392",
    "name": "إذاعة جدة",
    "city": "الرياض",
    "country": "السعودية",
    "stream_url": "https://live.kwikmotion.com/sbrksajeddahradiolive/ksajeddahradio/playlist.m3u8",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_393",
    "name": "بانوراما FM",
    "city": "الرياض",
    "country": "السعودية",
    "stream_url": "https://shls-panoramafm-prod-dub.shahid.net/out/v1/66262e420d824475aaae794dc2d69f14/index.m3u8",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_394",
    "name": "مكس FM",
    "city": "الرياض",
    "country": "السعودية",
    "stream_url": "https://s1.voscast.com:11377/live.mp3",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_395",
    "name": "MBC Loud",
    "city": "الرياض",
    "country": "السعودية",
    "stream_url": "https://d2lfa0y84k5bwn.cloudfront.net/out/v1/86dd4506a70c4d7fb35e2ab50296d9a3/index_8.m3u8",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_396",
    "name": "إذاعة القرآن الكريم",
    "city": "الرياض",
    "country": "السعودية",
    "stream_url": "https://live.kwikmotion.com/sbrksaquranradiolive/ksaquranradio/playlist.m3u8",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_397",
    "name": "راديو الشرق",
    "city": "الرياض",
    "country": "السعودية",
    "stream_url": "https://svs.itworkscdn.net/asharqradioalive/asharqradioa/playlist.m3u8",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_398",
    "name": "إذاعة خزامى",
    "city": "الرياض",
    "country": "السعودية",
    "stream_url": "https://live.kwikmotion.com/sbrksakhuzamaradiolive/khuzama/playlist.m3u8",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_399",
    "name": "MBC FM",
    "city": "الرياض",
    "country": "السعودية",
    "stream_url": "https://mbcfm-riyadh-prod-dub.shahid.net/out/v1/69c8a03f507e422f99cf5c07291c9e3a/index.m3u8",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_400",
    "name": "العربية FM",
    "city": "الرياض",
    "country": "السعودية",
    "stream_url": "https://fm.alarabiya.net/fm/myStream/playlist.m3u8",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_401",
    "name": "إذاعة نداء الإسلام",
    "city": "الرياض",
    "country": "السعودية",
    "stream_url": "https://live.kwikmotion.com/sbrksanedaradiolive/ksanedaradio/playlist.m3u8",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_402",
    "name": "إذاعة القرآن الكريم",
    "city": "جدة",
    "country": "السعودية",
    "stream_url": "https://live.kwikmotion.com/sbrksaquranradiolive/ksaquranradio/playlist.m3u8",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_403",
    "name": "إذاعة الرياض",
    "city": "جدة",
    "country": "السعودية",
    "stream_url": "https://live.kwikmotion.com/sbrksariyadhradiolive/ksariyadhradio/playlist.m3u8",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_404",
    "name": "إذاعة جدة",
    "city": "جدة",
    "country": "السعودية",
    "stream_url": "https://live.kwikmotion.com/sbrksajeddahradiolive/ksajeddahradio/playlist.m3u8",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_405",
    "name": "MBC Loud",
    "city": "جدة",
    "country": "السعودية",
    "stream_url": "https://d2lfa0y84k5bwn.cloudfront.net/out/v1/86dd4506a70c4d7fb35e2ab50296d9a3/index_8.m3u8",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_406",
    "name": "إذاعة خزامى",
    "city": "جدة",
    "country": "السعودية",
    "stream_url": "https://live.kwikmotion.com/sbrksakhuzamaradiolive/khuzama/playlist.m3u8",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_407",
    "name": "راديو UFM",
    "city": "جدة",
    "country": "السعودية",
    "stream_url": "http://stream.ufmradio.com:8000/stream",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_408",
    "name": "إذاعة نداء الإسلام",
    "city": "جدة",
    "country": "السعودية",
    "stream_url": "https://live.kwikmotion.com/sbrksanedaradiolive/ksanedaradio/playlist.m3u8",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_409",
    "name": "ألف ألف FM",
    "city": "جدة",
    "country": "السعودية",
    "stream_url": "https://alifalifjobs.com/radio/8000/AlifAlifLive.mp3",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_410",
    "name": "بانوراما FM",
    "city": "جدة",
    "country": "السعودية",
    "stream_url": "https://shls-panoramafm-prod-dub.shahid.net/out/v1/66262e420d824475aaae794dc2d69f14/index.m3u8",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_411",
    "name": "MBC FM",
    "city": "جدة",
    "country": "السعودية",
    "stream_url": "https://mbcfm-riyadh-prod-dub.shahid.net/out/v1/69c8a03f507e422f99cf5c07291c9e3a/index.m3u8",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_412",
    "name": "مكس FM",
    "city": "جدة",
    "country": "السعودية",
    "stream_url": "https://s1.voscast.com:11377/live.mp3",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_413",
    "name": "راديو الشرق",
    "city": "جدة",
    "country": "السعودية",
    "stream_url": "https://svs.itworkscdn.net/asharqradioalive/asharqradioa/playlist.m3u8",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_414",
    "name": "العربية FM",
    "city": "جدة",
    "country": "السعودية",
    "stream_url": "https://fm.alarabiya.net/fm/myStream/playlist.m3u8",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_415",
    "name": "إذاعة الإخبارية",
    "city": "جدة",
    "country": "السعودية",
    "stream_url": "https://live.kwikmotion.com/sbrksaikhbariyaradiolive/srpikhbariyaradio/playlist.m3u8",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_416",
    "name": "إذاعة القرآن الكريم",
    "city": "مكة المكرمة",
    "country": "السعودية",
    "stream_url": "https://live.kwikmotion.com/sbrksaquranradiolive/ksaquranradio/playlist.m3u8",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_417",
    "name": "إذاعة الرياض",
    "city": "مكة المكرمة",
    "country": "السعودية",
    "stream_url": "https://live.kwikmotion.com/sbrksariyadhradiolive/ksariyadhradio/playlist.m3u8",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_418",
    "name": "إذاعة جدة",
    "city": "مكة المكرمة",
    "country": "السعودية",
    "stream_url": "https://live.kwikmotion.com/sbrksajeddahradiolive/ksajeddahradio/playlist.m3u8",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_419",
    "name": "MBC Loud",
    "city": "مكة المكرمة",
    "country": "السعودية",
    "stream_url": "https://d2lfa0y84k5bwn.cloudfront.net/out/v1/86dd4506a70c4d7fb35e2ab50296d9a3/index_8.m3u8",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_420",
    "name": "إذاعة خزامى",
    "city": "مكة المكرمة",
    "country": "السعودية",
    "stream_url": "https://live.kwikmotion.com/sbrksakhuzamaradiolive/khuzama/playlist.m3u8",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_421",
    "name": "راديو UFM",
    "city": "مكة المكرمة",
    "country": "السعودية",
    "stream_url": "http://stream.ufmradio.com:8000/stream",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_422",
    "name": "إذاعة نداء الإسلام",
    "city": "مكة المكرمة",
    "country": "السعودية",
    "stream_url": "https://live.kwikmotion.com/sbrksanedaradiolive/ksanedaradio/playlist.m3u8",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_423",
    "name": "MBC FM",
    "city": "مكة المكرمة",
    "country": "السعودية",
    "stream_url": "https://mbcfm-riyadh-prod-dub.shahid.net/out/v1/69c8a03f507e422f99cf5c07291c9e3a/index.m3u8",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_424",
    "name": "بانوراما FM",
    "city": "مكة المكرمة",
    "country": "السعودية",
    "stream_url": "https://shls-panoramafm-prod-dub.shahid.net/out/v1/66262e420d824475aaae794dc2d69f14/index.m3u8",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_425",
    "name": "ألف ألف FM",
    "city": "مكة المكرمة",
    "country": "السعودية",
    "stream_url": "https://alifalifjobs.com/radio/8000/AlifAlifLive.mp3",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_426",
    "name": "مكس FM",
    "city": "مكة المكرمة",
    "country": "السعودية",
    "stream_url": "https://s1.voscast.com:11377/live.mp3",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_427",
    "name": "راديو الشرق",
    "city": "مكة المكرمة",
    "country": "السعودية",
    "stream_url": "https://svs.itworkscdn.net/asharqradioalive/asharqradioa/playlist.m3u8",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_428",
    "name": "إذاعة الإخبارية",
    "city": "مكة المكرمة",
    "country": "السعودية",
    "stream_url": "https://live.kwikmotion.com/sbrksaikhbariyaradiolive/srpikhbariyaradio/playlist.m3u8",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_429",
    "name": "إذاعة الرياض",
    "city": "المدينة المنورة",
    "country": "السعودية",
    "stream_url": "https://live.kwikmotion.com/sbrksariyadhradiolive/ksariyadhradio/playlist.m3u8",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_430",
    "name": "راديو UFM",
    "city": "المدينة المنورة",
    "country": "السعودية",
    "stream_url": "http://stream.ufmradio.com:8000/stream",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_431",
    "name": "إذاعة جدة",
    "city": "المدينة المنورة",
    "country": "السعودية",
    "stream_url": "https://live.kwikmotion.com/sbrksajeddahradiolive/ksajeddahradio/playlist.m3u8",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_432",
    "name": "إذاعة القرآن الكريم",
    "city": "المدينة المنورة",
    "country": "السعودية",
    "stream_url": "https://live.kwikmotion.com/sbrksaquranradiolive/ksaquranradio/playlist.m3u8",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_433",
    "name": "بانوراما FM",
    "city": "المدينة المنورة",
    "country": "السعودية",
    "stream_url": "https://shls-panoramafm-prod-dub.shahid.net/out/v1/66262e420d824475aaae794dc2d69f14/index.m3u8",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_434",
    "name": "MBC FM",
    "city": "المدينة المنورة",
    "country": "السعودية",
    "stream_url": "https://mbcfm-riyadh-prod-dub.shahid.net/out/v1/69c8a03f507e422f99cf5c07291c9e3a/index.m3u8",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_435",
    "name": "ألف ألف FM",
    "city": "المدينة المنورة",
    "country": "السعودية",
    "stream_url": "https://alifalifjobs.com/radio/8000/AlifAlifLive.mp3",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_436",
    "name": "إذاعة نداء الإسلام",
    "city": "المدينة المنورة",
    "country": "السعودية",
    "stream_url": "https://live.kwikmotion.com/sbrksanedaradiolive/ksanedaradio/playlist.m3u8",
    "logo": "",
    "category": "السعودية",
    "enabled": true
  },
  {
    "id": "station_437",
    "name": "BBC World Service",
    "city": "Mogadishu",
    "country": "الصومال",
    "stream_url": "https://stream.live.vc.bbcmedia.co.uk/bbc_world_service_east_africa",
    "logo": "",
    "category": "الصومال",
    "enabled": true
  },
  {
    "id": "station_438",
    "name": "Star FM",
    "city": "Mogadishu",
    "country": "الصومال",
    "stream_url": "https://stream.zeno.fm/ts7xywfh4f8uv",
    "logo": "",
    "category": "الصومال",
    "enabled": true
  },
  {
    "id": "station_439",
    "name": "Gool FM",
    "city": "Mogadishu",
    "country": "الصومال",
    "stream_url": "https://stream.radio.co/s74d91532f/listen",
    "logo": "",
    "category": "الصومال",
    "enabled": true
  },
  {
    "id": "station_440",
    "name": "راديو الرابعة",
    "city": "الخرطوم",
    "country": "السودان",
    "stream_url": "http://streams.radio.co/s909325731/listen",
    "logo": "",
    "category": "السودان",
    "enabled": true
  },
  {
    "id": "station_441",
    "name": "راديو هلا",
    "city": "الخرطوم",
    "country": "السودان",
    "stream_url": "http://108.61.34.50:7026/stream",
    "logo": "",
    "category": "السودان",
    "enabled": true
  },
  {
    "id": "station_442",
    "name": "نينار اف ام",
    "city": "القاهرة",
    "country": "سوريا",
    "stream_url": "http://ninarfm.grtvstream.com:8896/;stream.mp3",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_443",
    "name": "شام إف إم",
    "city": "القاهرة",
    "country": "سوريا",
    "stream_url": "https://radioshamfm.grtvstream.com:8400/stream",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_444",
    "name": "بي بي سي عربي",
    "city": "القاهرة",
    "country": "سوريا",
    "stream_url": "https://stream.live.vc.bbcmedia.co.uk/bbc_arabic_radio",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_445",
    "name": "راديو سبوتنيك",
    "city": "القاهرة",
    "country": "سوريا",
    "stream_url": "https://icecast-rian.cdnvideo.ru/voicearb",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_446",
    "name": "إذاعة القرآن الكريم",
    "city": "القاهرة",
    "country": "سوريا",
    "stream_url": "https://audio.osina.cloud:7987/stream",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_447",
    "name": "Version FM",
    "city": "القاهرة",
    "country": "سوريا",
    "stream_url": "https://versionfm.com:8100/stream",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_448",
    "name": "إذاعة دمشق",
    "city": "القاهرة",
    "country": "سوريا",
    "stream_url": "https://radiodamascus.ortas.live/RDimshq/RDimshqAudioLive/playlist.m3u8",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_449",
    "name": "التلفزيون العربي",
    "city": "القاهرة",
    "country": "سوريا",
    "stream_url": "https://l3.itworkscdn.net/alarabyradiolive/alarabyradio_audio/icecast.audio",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_450",
    "name": "صوت الغد",
    "city": "القاهرة",
    "country": "سوريا",
    "stream_url": "https://l3.itworkscdn.net/itwaudio/9030/stream",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_451",
    "name": "فرح اف ام",
    "city": "القاهرة",
    "country": "سوريا",
    "stream_url": "https://radio.farah.fm/;",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_452",
    "name": "راديو سوريا",
    "city": "القاهرة",
    "country": "سوريا",
    "stream_url": "https://stream1.syria.fm/syriatvlive/syriatv_audio/playlist.m3u8",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_453",
    "name": "راديو دلتا",
    "city": "القاهرة",
    "country": "سوريا",
    "stream_url": "https://radiodelta.fm/mp3",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_454",
    "name": "أرابيسك اف ام",
    "city": "القاهرة",
    "country": "سوريا",
    "stream_url": "http://185.4.87.79:8000/stream.mp3",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_455",
    "name": "إذاعة نجوم اف ام",
    "city": "القاهرة",
    "country": "سوريا",
    "stream_url": "http://185.105.4.53:4423/stream",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_456",
    "name": "قناة اﻟﺠﺰﻳﺮﺓ",
    "city": "القاهرة",
    "country": "سوريا",
    "stream_url": "https://live-hls-audio-web-aja.getaj.net/VOICE-AJA/index.m3u8",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_457",
    "name": "مونت كارلو الدولية",
    "city": "القاهرة",
    "country": "سوريا",
    "stream_url": "https://montecarlodoualiya128k.ice.infomaniak.ch/mc-doualiya.mp3",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_458",
    "name": "اذاعة صوت كل لبنان",
    "city": "القاهرة",
    "country": "سوريا",
    "stream_url": "https://audio.osina.cloud:9323/stream",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_459",
    "name": "TRT Radyo 1",
    "city": "القاهرة",
    "country": "سوريا",
    "stream_url": "https://trt.radyotvonline.net/trt1",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_460",
    "name": "TRT Çukurova Radyosu",
    "city": "القاهرة",
    "country": "سوريا",
    "stream_url": "https://radio-trtcukurova.medya.trt.com.tr/master.m3u8",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_461",
    "name": "عربي TRT",
    "city": "القاهرة",
    "country": "سوريا",
    "stream_url": "https://radio-trtarabi.medya.trt.com.tr/master.m3u8",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_462",
    "name": "BBC World Sevice",
    "city": "القاهرة",
    "country": "سوريا",
    "stream_url": "https://stream.live.vc.bbcmedia.co.uk/bbc_world_service",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_463",
    "name": "إذاعة العاصمة اونلاين",
    "city": "القاهرة",
    "country": "سوريا",
    "stream_url": "https://asima.out.airtime.pro/asima_a",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_464",
    "name": "صوت المحبة الشرق الأوسط",
    "city": "القاهرة",
    "country": "سوريا",
    "stream_url": "http://stream.zeno.fm/sb6wmu58938uv",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_465",
    "name": "راديو نسائم",
    "city": "القاهرة",
    "country": "سوريا",
    "stream_url": "https://stream.zeno.fm/u1wbm3k7gxquv",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_466",
    "name": "راديو روزنة",
    "city": "القاهرة",
    "country": "سوريا",
    "stream_url": "https://stream.zeno.fm/sq7y5y2z06duv",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_467",
    "name": "TRT Türkü",
    "city": "الإسكندرية",
    "country": "سوريا",
    "stream_url": "https://rd-trtturku.medya.trt.com.tr/master.m3u8",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_468",
    "name": "TRT Nağme",
    "city": "الإسكندرية",
    "country": "سوريا",
    "stream_url": "https://rd-trtnagme.medya.trt.com.tr/master.m3u8",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_469",
    "name": "نينار اف ام",
    "city": "الإسكندرية",
    "country": "سوريا",
    "stream_url": "http://ninarfm.grtvstream.com:8896/;stream.mp3",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_470",
    "name": "TRT Radyo Haber",
    "city": "الإسكندرية",
    "country": "سوريا",
    "stream_url": "https://trt.radyotvonline.net/trthaber",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_471",
    "name": "TRT Radyo 3",
    "city": "الإسكندرية",
    "country": "سوريا",
    "stream_url": "https://rd-trtradyo3.medya.trt.com.tr/master.m3u8",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_472",
    "name": "TRT-FM",
    "city": "الإسكندرية",
    "country": "سوريا",
    "stream_url": "https://trt.radyotvonline.net/trtfm",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_473",
    "name": "شام إف إم",
    "city": "الإسكندرية",
    "country": "سوريا",
    "stream_url": "https://radioshamfm.grtvstream.com:8400/stream",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_474",
    "name": "راديو صدى الفرات",
    "city": "الإسكندرية",
    "country": "سوريا",
    "stream_url": "https://wowza1.radyotvonline.com/idilpr/sadaelfurat.stream/playlist.m3u8",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_475",
    "name": "TRT Radyo 1",
    "city": "الإسكندرية",
    "country": "سوريا",
    "stream_url": "https://trt.radyotvonline.net/trt1",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_476",
    "name": "TRT Çukurova Radyosu",
    "city": "الإسكندرية",
    "country": "سوريا",
    "stream_url": "https://radio-trtcukurova.medya.trt.com.tr/master.m3u8",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_477",
    "name": "إذاعة دمشق",
    "city": "الإسكندرية",
    "country": "سوريا",
    "stream_url": "https://radiodamascus.ortas.live/RDimshq/RDimshqAudioLive/playlist.m3u8",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_478",
    "name": "راديو طيف",
    "city": "الإسكندرية",
    "country": "سوريا",
    "stream_url": "https://stream.zeno.fm/xbohf8qf5uauv",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_479",
    "name": "التلفزيون العربي",
    "city": "الإسكندرية",
    "country": "سوريا",
    "stream_url": "https://l3.itworkscdn.net/alarabyradiolive/alarabyradio_audio/icecast.audio",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_480",
    "name": "TRT Kurdî Radyo",
    "city": "الإسكندرية",
    "country": "سوريا",
    "stream_url": "https://radio-trtradyo6.medya.trt.com.tr/master.m3u8",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_481",
    "name": "فرح اف ام",
    "city": "الإسكندرية",
    "country": "سوريا",
    "stream_url": "https://radio.farah.fm/;",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_482",
    "name": "Yurt FM",
    "city": "الإسكندرية",
    "country": "سوريا",
    "stream_url": "https://wowza1.radyotvonline.com/idilpr/yurtfm.stream/playlist.m3u8",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_483",
    "name": "راديو نسائم",
    "city": "الإسكندرية",
    "country": "سوريا",
    "stream_url": "https://stream.zeno.fm/u1wbm3k7gxquv",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_484",
    "name": "إذاعة النور",
    "city": "الإسكندرية",
    "country": "سوريا",
    "stream_url": "https://l3.itworkscdn.net/itwaudio/9066/stream",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_485",
    "name": "راديو سوريا",
    "city": "الإسكندرية",
    "country": "سوريا",
    "stream_url": "https://stream1.syria.fm/syriatvlive/syriatv_audio/playlist.m3u8",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_486",
    "name": "Radyo Delal",
    "city": "الإسكندرية",
    "country": "سوريا",
    "stream_url": "https://wowza1.radyotvonline.com/idilpr/radyodelal.stream/playlist.m3u8",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_487",
    "name": "Diyanet Kur'an Radyo",
    "city": "الإسكندرية",
    "country": "سوريا",
    "stream_url": "https://eustr73.mediatriple.net/videoonlylive/mtikoimxnztxlive/broadcast_5e3c14192aa92.smil/playlist.m3u8",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_488",
    "name": "أرابيسك اف ام",
    "city": "الإسكندرية",
    "country": "سوريا",
    "stream_url": "http://185.4.87.79:8000/stream.mp3",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_489",
    "name": "إذاعة نجوم اف ام",
    "city": "الإسكندرية",
    "country": "سوريا",
    "stream_url": "http://185.105.4.53:4423/stream",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_490",
    "name": "Diyanet Radyo",
    "city": "الإسكندرية",
    "country": "سوريا",
    "stream_url": "https://eustr73.mediatriple.net/videoonlylive/mtikoimxnztxlive/broadcast_5e3c1171d7d2a.smil/playlist.m3u8",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_491",
    "name": "راديو البلد",
    "city": "الإسكندرية",
    "country": "سوريا",
    "stream_url": "https://stream.zeno.fm/gwvfzho5n5wuv",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_492",
    "name": "عربي TRT",
    "city": "الإسكندرية",
    "country": "سوريا",
    "stream_url": "https://radio-trtarabi.medya.trt.com.tr/master.m3u8",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_493",
    "name": "بي بي سي عربي",
    "city": "الإسكندرية",
    "country": "سوريا",
    "stream_url": "https://stream.live.vc.bbcmedia.co.uk/bbc_arabic_radio",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_494",
    "name": "BBC World Sevice",
    "city": "الإسكندرية",
    "country": "سوريا",
    "stream_url": "https://stream.live.vc.bbcmedia.co.uk/bbc_world_service",
    "logo": "",
    "category": "سوريا",
    "enabled": true
  },
  {
    "id": "station_495",
    "name": "إذاعة IFM",
    "city": "Tunis",
    "country": "تونس",
    "stream_url": "https://live.ifm.tn/radio/8000/ifmlive",
    "logo": "",
    "category": "تونس",
    "enabled": true
  },
  {
    "id": "station_496",
    "name": "إذاعة الزيتونة",
    "city": "Tunis",
    "country": "تونس",
    "stream_url": "https://stream.radiozitouna.tn/radio/8030/radio.mp3",
    "logo": "",
    "category": "تونس",
    "enabled": true
  },
  {
    "id": "station_497",
    "name": "إذاعة تونس الثقافية",
    "city": "Tunis",
    "country": "تونس",
    "stream_url": "http://rtstream.tanitweb.com/culturelle",
    "logo": "",
    "category": "تونس",
    "enabled": true
  },
  {
    "id": "station_498",
    "name": "الإذاعة الوطنية التونسية",
    "city": "Tunis",
    "country": "تونس",
    "stream_url": "http://rtstream.tanitweb.com/nationale",
    "logo": "",
    "category": "تونس",
    "enabled": true
  },
  {
    "id": "station_499",
    "name": "أكسيجان إف إم",
    "city": "Tunis",
    "country": "تونس",
    "stream_url": "https://radiooxygenefm.ice.infomaniak.ch/radiooxygenefm-64.mp3",
    "logo": "",
    "category": "تونس",
    "enabled": true
  },
  {
    "id": "station_500",
    "name": "موزاييك أف أم",
    "city": "Tunis",
    "country": "تونس",
    "stream_url": "https://radio.mosaiquefm.net/mosalive",
    "logo": "",
    "category": "تونس",
    "enabled": true
  },
  {
    "id": "station_501",
    "name": "راديو جوهرة أف آم",
    "city": "Tunis",
    "country": "تونس",
    "stream_url": "https://streaming2.toutech.net/jawharafm",
    "logo": "",
    "category": "تونس",
    "enabled": true
  },
  {
    "id": "station_502",
    "name": "إذاعة بانوراما",
    "city": "Tunis",
    "country": "تونس",
    "stream_url": "https://stream.tun-radio.com/radio/8000/panorama_92",
    "logo": "",
    "category": "تونس",
    "enabled": true
  },
  {
    "id": "station_503",
    "name": "إذاعة الشباب",
    "city": "Tunis",
    "country": "تونس",
    "stream_url": "http://rtstream.tanitweb.com/jeunes",
    "logo": "",
    "category": "تونس",
    "enabled": true
  },
  {
    "id": "station_504",
    "name": "راديو 6",
    "city": "Tunis",
    "country": "تونس",
    "stream_url": "https://stream.tun-radio.com/radio/8070/r6.mp3",
    "logo": "",
    "category": "تونس",
    "enabled": true
  },
  {
    "id": "station_505",
    "name": "راديو ماد",
    "city": "Tunis",
    "country": "تونس",
    "stream_url": "http://stream6.tanitweb.com/radiomed",
    "logo": "",
    "category": "تونس",
    "enabled": true
  },
  {
    "id": "station_506",
    "name": "اكسبرس فم",
    "city": "Tunis",
    "country": "تونس",
    "stream_url": "https://expressfm.ice.infomaniak.ch/expressfm-64.mp3",
    "logo": "",
    "category": "تونس",
    "enabled": true
  },
  {
    "id": "station_507",
    "name": "إذاعة المنستير",
    "city": "Tunis",
    "country": "تونس",
    "stream_url": "http://rtstream.tanitweb.com/monastir",
    "logo": "",
    "category": "تونس",
    "enabled": true
  },
  {
    "id": "station_508",
    "name": "Medi 1 radio",
    "city": "Tunis",
    "country": "تونس",
    "stream_url": "https://live.medi1.com/medi1#.mp3",
    "logo": "",
    "category": "تونس",
    "enabled": true
  },
  {
    "id": "station_509",
    "name": "الإذاعة الجزائرية - Jil FM",
    "city": "Tunis",
    "country": "تونس",
    "stream_url": "https://webradio.tda.dz/Jeunesse_64K.mp3",
    "logo": "",
    "category": "تونس",
    "enabled": true
  },
  {
    "id": "station_510",
    "name": "سكاي نيوز عربية",
    "city": "أبوظبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "http://radio.skynewsarabia.com/stream/radio/skynewsarabia",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_511",
    "name": "إذاعة الشارقة",
    "city": "أبوظبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://l3.itworkscdn.net/smcradiolive/smcradiolive/icecast.audio",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_512",
    "name": "إذاعة صوت الخليج",
    "city": "أبوظبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "http://ruby.streamguys.com:8120/sar-qatar-2",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_513",
    "name": "إذاعة الكويت البرنامج العام",
    "city": "أبوظبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://kwtkrdota.cdn.mangomolo.com/k1rdo/k1rdo.stream_aac/index.m3u8",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_514",
    "name": "رادیو ایران",
    "city": "أبوظبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://s1.cdn3.iranseda.ir/liveedge/radio-iran/playlist.m3u8",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_515",
    "name": "القرآن الكريم 106.1",
    "city": "أبوظبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://5c7b683162943.streamlock.net/live/ngrp:radio-106-1_all/playlist.m3u8",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_516",
    "name": "إذاعــة سلـطنة عمان",
    "city": "أبوظبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://partne.cdn.mgmlcdn.com/omanrdoorg/omanrdo.stream_aac/chunklist.m3u8",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_517",
    "name": "رادیو فارس",
    "city": "أبوظبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://s1.cdn3.iranseda.ir/liveedgeprovincial/radio-fars/playlist.m3u8",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_518",
    "name": "إذاعة قطر",
    "city": "أبوظبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://qmclivestreaming.qa/QRS/myStream/Playlist.m3u8",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_519",
    "name": "رادیو خلیج فارس",
    "city": "أبوظبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://s1.cdn3.iranseda.ir/liveedgeprovincial/radio-bandarabas/playlist.m3u8",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_520",
    "name": "اذاعة طهران العربية",
    "city": "أبوظبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://s2.cdn1.iranseda.ir/liveedge/radio-arabic/playlist.m3u8",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_521",
    "name": "بحرين راديو 102.3",
    "city": "أبوظبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://5c7b683162943.streamlock.net/live/ngrp:radio-102-3_all/playlist.m3u8",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_522",
    "name": "BBC World Service",
    "city": "أبوظبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://stream.live.vc.bbcmedia.co.uk/bbc_world_service",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_523",
    "name": "بی بی سی دری",
    "city": "أبوظبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://stream.live.vc.bbcmedia.co.uk/bbc_dari_radio",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_524",
    "name": "بی بی سی پښتو",
    "city": "أبوظبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://stream.live.vc.bbcmedia.co.uk/bbc_pashto_radio",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_525",
    "name": "رادیو فردا",
    "city": "أبوظبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://stream.radiojar.com/cp13r2cpn3quv",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_526",
    "name": "Tamil FM",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://stream.zeno.fm/pq1y91zes18uv",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_527",
    "name": "سكاي نيوز عربية",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "http://radio.skynewsarabia.com/stream/radio/skynewsarabia",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_528",
    "name": "Tag 91.1",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://stream.radiojar.com/bpv82qebsxquv",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_529",
    "name": "إذاعة دبي للقرآن",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "http://uk5.internet-radio.com:8079/stream",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_530",
    "name": "Dubai 92",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://stream.radiojar.com/6ty5rrkerxquv",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_531",
    "name": "إذاعة الفجيرة",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://fujairah.fm/stream.php",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_532",
    "name": "اذاعة دبي اف ام",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://dmithrvll.cdn.mangomolo.com/dubairdo/dubairdo_aac/playlist.m3u8",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_533",
    "name": "رادیو شما 93.4",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://stream.radiojar.com/rzcfw4cbsxquv",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_534",
    "name": "إذاعة نور دبي",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://dmithrvll.cdn.mangomolo.com/noordubairdo/noordubairdo_aac/playlist.m3u8",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_535",
    "name": "إذاعة الشارقة",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://l3.itworkscdn.net/smcradiolive/smcradiolive/icecast.audio",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_536",
    "name": "Pure 94.7",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://stream.rcs.revma.com/r6hktd84u7zuv",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_537",
    "name": "Pulse 95",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://l3.itworkscdn.net/pulse95live/pulse96/icecast.audio",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_538",
    "name": "وتر اف ام",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://l3.itworkscdn.net/smcwatarlive/smcwatar/icecast.audio",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_539",
    "name": "Hit 96.7",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://stream.radiojar.com/3yygc0pwuueuv",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_540",
    "name": "Beat 97.8",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://funasia.streamguys1.com/live3",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_541",
    "name": "العربية 99",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://stream.radiojar.com/s1mygd1frxquv",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_542",
    "name": "Club FM",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://playerservices.streamtheworld.com/api/livestream-redirect/CLUBFMUAE.mp3",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_543",
    "name": "Talk 100.3",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://funasia.streamguys1.com/live13",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_544",
    "name": "الخليجية 100.9",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://stream.radiojar.com/5wpf9e4erxquv",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_545",
    "name": "Gold FM",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://stream.radio.co/s00240810b/listen",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_546",
    "name": "City 101.6",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://stream.radiojar.com/gmwyu8xdrxquv",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_547",
    "name": "إذاعة القرآن من الشارقة",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://l3.itworkscdn.net/smcquranlive/quranradiolive/icecast.audio",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_548",
    "name": "Dubai Eye",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://stream.radiojar.com/shcthrfbsxquv",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_549",
    "name": "Channel 4",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://streams.radio.co/sce558c2e6/listen",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_550",
    "name": "Big 106.2",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://funasia.streamguys1.com/live4",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_551",
    "name": "Luv 107.1",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://funasia.streamguys1.com/live2",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_552",
    "name": "إذاعة الأولى",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "http://uk6.internet-radio.com:8103/stream",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_553",
    "name": "راديو الرابعة",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://s2.radio.co/s770fa24b6/listen",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_554",
    "name": "إذاعة الكويت البرنامج العام",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://kwtkrdota.cdn.mangomolo.com/k1rdo/k1rdo.stream_aac/index.m3u8",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_555",
    "name": "رادیو ایران",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://s1.cdn3.iranseda.ir/liveedge/radio-iran/playlist.m3u8",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_556",
    "name": "القرآن الكريم 106.1",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://5c7b683162943.streamlock.net/live/ngrp:radio-106-1_all/playlist.m3u8",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_557",
    "name": "إذاعــة سلـطنة عمان",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://partne.cdn.mgmlcdn.com/omanrdoorg/omanrdo.stream_aac/chunklist.m3u8",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_558",
    "name": "رادیو فارس",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://s1.cdn3.iranseda.ir/liveedgeprovincial/radio-fars/playlist.m3u8",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_559",
    "name": "إذاعة قطر",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://qmclivestreaming.qa/QRS/myStream/Playlist.m3u8",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_560",
    "name": "رادیو خلیج فارس",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://s1.cdn3.iranseda.ir/liveedgeprovincial/radio-bandarabas/playlist.m3u8",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_561",
    "name": "اذاعة طهران العربية",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://s2.cdn1.iranseda.ir/liveedge/radio-arabic/playlist.m3u8",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_562",
    "name": "بحرين راديو 102.3",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://5c7b683162943.streamlock.net/live/ngrp:radio-102-3_all/playlist.m3u8",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_563",
    "name": "BBC World Service",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://stream.live.vc.bbcmedia.co.uk/bbc_world_service",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_564",
    "name": "بی بی سی دری",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://stream.live.vc.bbcmedia.co.uk/bbc_dari_radio",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_565",
    "name": "بی بی سی پښتو",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://stream.live.vc.bbcmedia.co.uk/bbc_pashto_radio",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_566",
    "name": "رادیو فردا",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://stream.radiojar.com/cp13r2cpn3quv",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_567",
    "name": "راديو صدى",
    "city": "دبي",
    "country": "الإمارات العربية المتحدة",
    "stream_url": "https://eu10.fastcast4u.com:14580/;stream.mp3/stream.mp3",
    "logo": "",
    "category": "الإمارات العربية المتحدة",
    "enabled": true
  },
  {
    "id": "station_568",
    "name": "إذاعة الرسالة",
    "city": "صنعاء",
    "country": "اليمن",
    "stream_url": "https://alresalh.radioca.st/index",
    "logo": "",
    "category": "اليمن",
    "enabled": true
  },
  {
    "id": "station_569",
    "name": "إذاعة 21 سبتمبر",
    "city": "صنعاء",
    "country": "اليمن",
    "stream_url": "https://sept21.radioca.st/index",
    "logo": "",
    "category": "اليمن",
    "enabled": true
  },
  {
    "id": "station_570",
    "name": "إذاعة صنعاء",
    "city": "صنعاء",
    "country": "اليمن",
    "stream_url": "https://dc5.serverse.com/proxy/pbmhbvxs/stream",
    "logo": "",
    "category": "اليمن",
    "enabled": true
  },
  {
    "id": "station_571",
    "name": "إيرام إف إم",
    "city": "صنعاء",
    "country": "اليمن",
    "stream_url": "http://icecast2.edisimo.com:8000/eramfm.mp3",
    "logo": "",
    "category": "اليمن",
    "enabled": true
  },
  {
    "id": "station_572",
    "name": "إذاعة وطن",
    "city": "صنعاء",
    "country": "اليمن",
    "stream_url": "https://s12.myradiostream.com:16308/;stream.mp3",
    "logo": "",
    "category": "اليمن",
    "enabled": true
  },
  {
    "id": "station_573",
    "name": "يمن شباب FM",
    "city": "صنعاء",
    "country": "اليمن",
    "stream_url": "https://starmenajo.com:3030/radio/yemenshabab.mp3",
    "logo": "",
    "category": "اليمن",
    "enabled": true
  },
  {
    "id": "station_574",
    "name": "اذاعة صوت الشعب",
    "city": "صنعاء",
    "country": "اليمن",
    "stream_url": "https://sawtalshaab3.radioca.st/index",
    "logo": "",
    "category": "اليمن",
    "enabled": true
  },
  {
    "id": "station_575",
    "name": "إذاعة آفاق",
    "city": "صنعاء",
    "country": "اليمن",
    "stream_url": "https://edge.mixlr.com/channel/rumps",
    "logo": "",
    "category": "اليمن",
    "enabled": true
  },
  {
    "id": "station_576",
    "name": "سام إف إم",
    "city": "صنعاء",
    "country": "اليمن",
    "stream_url": "http://edge.mixlr.com/channel/kijwr",
    "logo": "",
    "category": "اليمن",
    "enabled": true
  },
  {
    "id": "station_577",
    "name": "إذاعة دلتا اف ام",
    "city": "صنعاء",
    "country": "اليمن",
    "stream_url": "http://cp12.serverse.com:7057/stream",
    "logo": "",
    "category": "اليمن",
    "enabled": true
  },
  {
    "id": "station_578",
    "name": "الإذاعة التعليمية",
    "city": "صنعاء",
    "country": "اليمن",
    "stream_url": "https://dc1.serverse.com/proxy/phxhzedb/stream",
    "logo": "",
    "category": "اليمن",
    "enabled": true
  },
  {
    "id": "station_579",
    "name": "إذاعة الرياض",
    "city": "صنعاء",
    "country": "اليمن",
    "stream_url": "https://live.kwikmotion.com/sbrksariyadhradiolive/ksariyadhradio/playlist.m3u8",
    "logo": "",
    "category": "اليمن",
    "enabled": true
  },
  {
    "id": "station_580",
    "name": "إذاعة القرآن الكريم",
    "city": "صنعاء",
    "country": "اليمن",
    "stream_url": "https://live.kwikmotion.com/sbrksaquranradiolive/ksaquranradio/playlist.m3u8",
    "logo": "",
    "category": "اليمن",
    "enabled": true
  },
  {
    "id": "station_581",
    "name": "عدنية إف إم",
    "city": "عدن",
    "country": "اليمن",
    "stream_url": "https://r.fm-radio.net/adania",
    "logo": "",
    "category": "اليمن",
    "enabled": true
  },
  {
    "id": "station_582",
    "name": "راديو عدن الغد",
    "city": "عدن",
    "country": "اليمن",
    "stream_url": "https://r.fm-radio.net/adengad",
    "logo": "",
    "category": "اليمن",
    "enabled": true
  },
  {
    "id": "station_583",
    "name": "إذاعة بندر عدن",
    "city": "عدن",
    "country": "اليمن",
    "stream_url": "https://stream.zeno.fm/542gubz258quv",
    "logo": "",
    "category": "اليمن",
    "enabled": true
  },
  {
    "id": "station_584",
    "name": "هنا عدن اف ام",
    "city": "عدن",
    "country": "اليمن",
    "stream_url": "https://c30.radioboss.fm:18267/stream",
    "logo": "",
    "category": "اليمن",
    "enabled": true
  },
  {
    "id": "station_585",
    "name": "نور عدن FM",
    "city": "عدن",
    "country": "اليمن",
    "stream_url": "https://c2.radioboss.fm:8768/stream",
    "logo": "",
    "category": "اليمن",
    "enabled": true
  },
  {
    "id": "station_586",
    "name": "التلفزيون العربي",
    "city": "عدن",
    "country": "اليمن",
    "stream_url": "https://l3.itworkscdn.net/alarabyradiolive/alarabyradio_audio/icecast.audio",
    "logo": "",
    "category": "اليمن",
    "enabled": true
  },
  {
    "id": "station_587",
    "name": "إذاعة بندر عدن",
    "city": "عدن",
    "country": "اليمن",
    "stream_url": "https://r.fm-radio.net/bndr",
    "logo": "",
    "category": "اليمن",
    "enabled": true
  },
  {
    "id": "station_588",
    "name": "إذاعة الرياض",
    "city": "عدن",
    "country": "اليمن",
    "stream_url": "https://live.kwikmotion.com/sbrksariyadhradiolive/ksariyadhradio/playlist.m3u8",
    "logo": "",
    "category": "اليمن",
    "enabled": true
  },
  {
    "id": "station_589",
    "name": "إذاعة القرآن الكريم",
    "city": "عدن",
    "country": "اليمن",
    "stream_url": "https://live.kwikmotion.com/sbrksaquranradiolive/ksaquranradio/playlist.m3u8",
    "logo": "",
    "category": "اليمن",
    "enabled": true
  }
];
