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
const domains = [
    "amara.org",
    "app.elucidat.com",
    "berkeleyextension.globalalumni.org",
    "campus.iese.edu",
    "dub.scorm.canvaslms.com",
    "ecampus.esade.edu",
    "elucidat.com",
    "esadeinon.instructure.com",
    "globalalumni.instructure.com",
    "globalalumni.org",
    "iad.scorm.canvaslms.com",
    "iese.edu",
    "learning.elucidat.com",
    "learningcampus.org",
    "mitpeonline.com",
    "mitpevirtualcampus.com",
    "online.centrogarrigues.com",
    "online.esade.edu",
    "professionalprograms.mit.edu",
    "programas.uclaextension.globalalumni.org",
    "programas.universidad-online-uees.com",
    "programas.usilmiami.com",
    "programasprofesionales.mit.edu",
    "scorm-iad-prod.insops.net",
    "sts.iese.edu",
    "uclaextension.globalalumni.org"
];
```