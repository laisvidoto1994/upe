#!/bin/bash

# $1 = usuario

if [ $# -lt 1 ]; then
   echo "Parâmetros errados. Utilize: sh tfidf.sh << output folder >>"
   exit 1
fi

cd ~/code/tfidf

export STREAM_JAR=/home/vagrant/hadoop/share/hadoop/tools/lib/hadoop-streaming-2.7.4.jar
hadoop fs -rm -r /$1/output/tfidf/

hadoop jar  $STREAM_JAR  \
	 -files tf_map.py,tf_reduce.py \
	 -mapper tf_map.py  \
	 -reducer tf_reduce.py \
	 -input /poli/gutenberg  \
	 -output /$1/output/tfidf/tf

hadoop jar  $STREAM_JAR  \
     -files df_map.py,df_reduce.py \
     -mapper df_map.py \
     -reducer df_reduce.py \
     -input /$1/output/tfidf/tf \
     -output /$1/output/tfidf/df

hadoop jar  $STREAM_JAR  \
     -files ntdoc_map.py,ntdoc_reduce.py \
     -mapper ntdoc_map.py \
     -reducer ntdoc_reduce.py \
     -input /poli/gutenberg \
     -output /$1/output/tfidf/ntdoc

hadoop jar  $STREAM_JAR  \
     -files tfidf_map.py,tfidf_reduce.py \
     -mapper tfidf_map.py \
     -reducer tfidf_reduce.py \
     -input /$1/output/tfidf/df \
     -input /$1/output/tfidf/ntdoc \
     -output /$1/output/tfidf/unsorted

hadoop jar  $STREAM_JAR  \
     -files sort_map.py,sort_reduce.py \
     -mapper sort_map.py \
     -reducer sort_reduce.py \
     -input /$1/output/tfidf/unsorted \
     -output /$1/output/tfidf/sorted

cd ~

hadoop fs -text /$1/output/tfidf/sorted/part* | more
