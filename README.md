# FAT
**The Fulcrum Applicant Tracking System**

*created by Baydin's Summer 2015 Interns*

### What is it?
This project was started to create an applicant tracking system using modern technologies that facilitates Baydin's existing recruiting workflow.

### Setup

First, install the dependencies. You may wish to do this inside of a virtualenv that you create at the root of the repository. 

```
pip install django djangorestframework boto
```

Then you'll need to create a `secrets.py` and place it in the same directory as `settings.py`. It should contain the following (which should not be checked into git):

```
SECRET_KEY = "abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(-_=+)"
AWS_ACCESS_KEY = "ABCDEFGHIJKLMNOPQRST"
AWS_SECRET_KEY = "ABCDEFGHIJKLMNOPQRSTUVWXYZ12345678901234"
AWS_S3_BUCKET = "fatfiles.acmecorp"
```

The AWS keys are currently just used to upload static files (for example, resumes) to S3. Amazon will generate the access/secret key pair for you. The S3 bucket must be globally unique and since they can be accessed as subdomains of Amazon's S3 service, [Amazon's best practices](http://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html) suggest that S3 bucket names be namespaced to your organization and chosen in a DNS-compliant style.

You can securely generate a new Django secret key with the following python snippet:
```
import random
SECRET_KEY = ''.join([random.SystemRandom().choice('abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(-_=+)') for i in range(50)])
```



