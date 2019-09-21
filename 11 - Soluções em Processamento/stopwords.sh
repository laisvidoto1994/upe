#!/bin/bash

# $1 = output folder

if [ $# -lt 1 ]; then
   echo "Parâmetros errados. Utilize: sh stopwords.sh << output folder >>"
   exit 1
fi

cd ~/code/stopwords

export STREAM_JAR=/home/vagrant/hadoop/share/hadoop/tools/lib/hadoop-streaming-2.7.4.jar

hadoop fs -rm -r /$1/output/stopwords/

hadoop jar      $STREAM_JAR      \
	 -files tf_map.py,tf_reduce.py      \
	 -mapper tf_map.py      \
	 -reducer tf_reduce.py      \
	 -input /poli/gutenberg      \
	 -output /$1/output/stopwords/tf

hadoop jar $STREAM_JAR      \
     -files df_map.py,df_reduce.py \
     -mapper df_map.py \
     -reducer df_reduce.py \
     -input /$1/output/stopwords/tf \
     -output /$1/output/stopwords/df

hadoop jar $STREAM_JAR      \
     -files ntdoc_map.py,ntdoc_reduce.py \
     -mapper ntdoc_map.py \
     -reducer ntdoc_reduce.py \
     -input /poli/gutenberg      \
     -output /$1/output/stopwords/ntdoc

hadoop jar $STREAM_JAR      \
     -files tfidf_map.py,tfidf_reduce.py \
     -mapper tfidf_map.py \
     -reducer tfidf_reduce.py \
     -input /$1/output/stopwords/df \
     -input /$1/output/stopwords/ntdoc \
     -output /$1/output/stopwords/unsorted

hadoop jar $STREAM_JAR      \
     -files stopwords_map.py,stopwords_reduce.py \
     -mapper stopwords_map.py \
     -reducer stopwords_reduce.py \
     -input /$1/output/stopwords/unsorted \
     -output /$1/output/stopwords/sorted

hadoop fs -text /$1/output/stopwords/sorted/part*
