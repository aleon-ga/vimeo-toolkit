# vimeo-toolkit

### For testing:
- 919245594 => Vídeo eliminado
- 913816911 => Vídeo sin text tracks
- 911288499 => Vídeo sin auto-generated captions

*Controller `checkShowcasePrivacy` request body*:

- Testing:
{
    "Test": [
        "Dev"
    ]
}

- Production:
{
    "FEB24": [
        "BOOTH",
        "GRAHAM",
        "MITPE",
        "PENN",
        "UCPE",
        "UMHBS",
        "XPRO"
    ]
}

**Embed domains list ref.:**

```js
const embed_domains = [
    '82.223.3.92',
    'a3-191395075.cluster3.canvas-user-content.com',
    'alumniesade.com',
    'amara.org',
    'articulate.com',
    'basecamp.com',
    'berkeley.edu',
    'berkeleyextension.globalalumni.org',
    'berkeleyextensiononline.com',
    'boothexedonline.com',
    'campus.iese.edu',
    'campusesade.com',
    'canvas-user-content.com',
    'ccii.es',
    'ceudigital.com',
    'cluster3.canvas-user-content.com',
    'devceu.globalalumni.org',
    'digitalcourses-ga.xpro.mit.edu',
    'dub.scorm.canvaslms.com',
    'ecampus.esade.edu',
    'elucidat.com',
    'esade.edu',
    'esadeinon.instructure.com',
    'execedon.chicagobooth.edu',
    'globalalumni.instructure.com',
    'globalalumni.org',
    'globalalumni.xpromit.com',
    'globalcourses.xpro.mit.edu',
    'iad.scorm.canvaslms.com',
    'iese.edu',
    'inonesade.com',
    'learning.elucidat.com',
    'learningcampus.org',
    'mitpeonline.com',
    'mitpevirtualcampus.com',
    'myesade.esade.edu',
    'online.centrogarrigues.com',
    'online.esade.edu',
    'online.professional.uchicago.edu',
    'onlinelearning.berkeley.edu',
    'onlineprofessionaluchicago.com',
    'pablorivas.es',
    'profesional.uchicago.edu',
    'professional.uchicago.edu',
    'professionalprograms.mit.edu',
    'professionalprogramsmit.com',
    'programas.uclaextension.globalalumni.org',
    'programas.universidad-online-uees.com',
    'programas.usilmiami.com',
    'programasprofesionales.mit.edu',
    'prometheus.globalalumni.org',
    'rise.articulate.com',
    'scorm-iad-prod.insops.net',
    'spanish.xpro.mit.edu',
    'spanishcourses.xpro.mit.edu',
    'sts.iese.edu',
    'uchicago.edu',
    'uchicagodigital.com',
    'uclaextension.globalalumni.org',
    'uclaextensiononline.com',
    'usilonlife.com'
];
```