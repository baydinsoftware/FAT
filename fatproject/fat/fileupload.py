from boto.s3.connection import S3Connection
from boto.s3.key import Key

AWS_ACCESS_KEY = 'REPLACE_WITH_YOUR_AWS_ACCESS_KEY'
AWS_SECRET_KEY = 'REPLACE_WITH_YOUR_AWS_SECRET_KEY'
AWS_BUCKET = 'COMPANYNAME.fatfiles'

def check_if_key_exists(filename):
	conn = S3Connection(AWS_ACCESS_KEY, AWS_SECRET_KEY)
	bucket = conn.get_bucket(AWS_BUCKET)
	return bucket.get_key(filename)

def get_key_from_bucket(filename):
	conn = S3Connection(AWS_ACCESS_KEY, AWS_SECRET_KEY)
	k = Key(conn.get_bucket(AWS_BUCKET))
	k.key = filename
	return k

def initialize_string_in_bucket(filename):
	k = get_key_from_bucket(filename)
	k.set_contents_from_string('this is an initial string for ' + filename)

def get_file_contents_as_string(filename):
	k = get_key_from_bucket(filename)
	return k.get_contents_as_string()

def put_file_in_bucket_from_path(filename, filepath):
	k = get_key_from_bucket(filename)
	k.set_contents_from_filename(filepath)

def put_file_in_bucket_directly(filename, fileinstance):
	k = get_key_from_bucket(filename)
	k.send_file(fileinstance)

def put_file_in_bucket_as_string(filename, filestring):
	k = get_key_from_bucket(filename)
	k.set_contents_from_string(filestring)
	
def get_file_from_key_to_file(filename):
	k = get_key_from_bucket(filename)
	return k.get_contents_to_filename(filename)

def delete_key(filename):
	k = get_key_from_bucket(filename)
	k.delete()

def empty_bucket():
	conn = S3Connection(AWS_ACCESS_KEY, AWS_SECRET_KEY)
	bucket = conn.get_bucket(AWS_BUCKET)
	for key in bucket.list():
		key.delete()

def list_keys():
	conn = S3Connection(AWS_ACCESS_KEY, AWS_SECRET_KEY)
	bucket = conn.get_bucket(AWS_BUCKET)
	for key in bucket.list():
		print key