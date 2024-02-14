# Package Types

## SubscriberPackage and SubscriberPackageVersion

These are visible to the subscriber orgs WITHOUT any connection to the original Devhub.

SubscriberPackage (033)

SubscriberPackageVersion (04t)

SubscriberPackage +---< SubscriberPackageVersion

### Examples

SELECT Id, Name, Description FROM SubscriberPackage WHERE Id = '033t000000005AAAAA'

 ID                 NAME             DESCRIPTION
 ────────────────── ──────────────── ─────────────── 
 033t000000005AAAAA my-cool-package  my cool package

SELECT Id, Name, SubscriberPackageId FROM SubscriberPackageVersionId WHERE Id = '04t3d0000000aAAAAA'

 ID                 NAME                    SUBSCRIBERPACKAGEVERSIONID 
 ────────────────── ─────────────────────── ────────────────────────── 
 04t3d0000000aAAAAA my-cool-package v1.2.0  033t000000005AAAAA

 ## Package2 and Package2Version

 These are visible ONLY to the original DevHub.

 Package2 (0Ho)

 Package2Version (05i)

 Package2 +---< Package2Version

 ### Examples

 SELECT Id, Name, Description FROM Package2 WHERE Id = '0Hot0000000BBBAAAA'

  ID                 NAME             DESCRIPTION
 ────────────────── ──────────────── ─────────────── 
 0Hot0000000BBBAAAA my-cool-package  my cool package

 SELECT Id, Name, Pacakge2Id FROM Package2Version WHERE Id = '05i30000000AAAAAA'

 ID                 NAME                             PACKAGE2ID          SUBSCRIBERPACKAGEVERSIONID
 ────────────────── ───────────────────────────────  ─────────────────── ───────────────────────────
 05i30000000AAAAAA  trillium-address-service v1.2.0  0Hot0000000BBBAAAA  04t3d0000000aAAAAA
