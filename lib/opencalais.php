<?php

/**
* Open Calais Tags
* Last updated 1/16/2012
* Copyright (c) 2012 Dan Grossman
* http://www.dangrossman.info
*
* Please see    
* for documentation and license information.
*/

class OpenCalaisException extends Exception {}

class OpenCalais {

    private $api_url = 'http://api.opencalais.com/enlighten/rest/';
    private $api_key = 't7vydt6bxg5m6v2vtc7bk929';
    private $outputFormat = 'text/simple';

    public $contentType = 'text/html';
    public $getGenericRelations = true;
    public $getSocialTags = true;
    public $docRDFaccessible = false;
    public $allowDistribution = false;
    public $allowSearch = false;
    public $externalID = '';
    public $submitter = '';
    public $complexParse = true;

    private $document = '';
    private $entities = array();
    private $complexEntities = array();
    //private $res = '';

    public function OpenCalais($api_key) {
        if (empty($api_key)) {
            throw new OpenCalaisException('An OpenCalais API key is required to use this class.');
        }
        $this->api_key = $api_key;
    }

    public function getEntities($document) {

        $this->document = $document;

        $this->callAPI();

        return $this->entities;

    }

    private function getParamsXML() {

        $types = array();
        if ($this->getGenericRelations)
            $types[] = 'GenericRelations';
        if ($this->getSocialTags)
            $types[] = 'SocialTags';
        
        $xml = '<c:params xmlns:c="http://s.opencalais.com/1/pred/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">';
        $xml .= '<c:processingDirectives ';
        $xml .= 'c:contentType="' . $this->contentType . '" ';
        $xml .= 'c:enableMetadataType="' . implode(',', $types) . '" ';
        $xml .= 'c:outputFormat="' . $this->outputFormat . '" ';
        $xml .= 'c:docRDFaccessible="' . ($this->docRDFaccessible ? 'true' : 'false') . '" ';
        $xml .= '></c:processingDirectives>';
        $xml .= '<c:userDirectives ';
        $xml .= 'c:allowDistribution="' . ($this->allowDistribution ? 'true' : 'false') . '" ';
        $xml .= 'c:allowSearch="' . ($this->allowSearch ? 'true' : 'false') . '" ';

        if (!empty($this->externalID))
            $xml .= 'c:externalID="' . htmlspecialchars($this->externalID) . '" ';

        if (!empty($this->submitter))
            $xml .= 'c:submitter="' . htmlspecialchars($this->submitter) . '" ';

        $xml .= '></c:userDirectives>';
        $xml .= '<c:externalMetadata></c:externalMetadata>';
        $xml .= '</c:params>';
        
        return $xml;

    }

    private function callAPI() {

        $data = 'licenseID=' . urlencode($this->api_key);
        $data .= '&paramsXML=' . urlencode($this->getParamsXML());
        $data .= '&content=' . urlencode($this->document);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->api_url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_POST, 1);
        $response = curl_exec($ch);
        $this->res = $response;

        if (strpos($response, "<Exception>") !== false) {
            $text = preg_match("/<Exception\>(.*)<\/Exception>/mu", $response, $matches);
            throw new OpenCalaisException($matches[1]);
        }

        if ($this->complexParse) {
            //Complex Parse
        $p = xml_parser_create();
        xml_parse_into_struct($p, $response, $vals, $index);
        xml_parser_free($p);

        $forbidden_keys = array("OPENCALAISSIMPLE","DESCRIPTION","ALLOWDISTRIBUTION","ALLOWSEARCH","CALAISREQUESTID","ID","ABOUT","DOCTITLE","DOCDATE","EXTERNALMETADATA","CALAISSIMPLEOUTPUTFORMAT","SOCIALTAGS","TOPIC","TOPICS","ORIGINALVALUE");

        foreach ($index as $i_key => $i_value) {
            if (!in_array($i_key, $forbidden_keys)) {
                foreach ($i_value as $iv_key => $iv_value) {
                    if ($vals[$iv_value]['tag'] == 'SOCIALTAG' && $vals[$iv_value]['type'] == 'open') {
                        $this->entities[$i_key][] = array(
                        'name' => $vals[$iv_value]['value'],
                        'importance' => $vals[$iv_value]['attributes']['IMPORTANCE']
                        
                        );
                    } elseif ($vals[$iv_value]['type'] != 'close') {
                        $this->entities[$i_key][] = array(
                        'name' => $vals[$iv_value]['value'],
                        'count' => $vals[$iv_value]['attributes']['COUNT'],
                        'relevancy' => $vals[$iv_value]['attributes']['RELEVANCE'],
                        //'index' => $iv_value
                    );
                    }
                    
                }
            }
        }
        } else {
            //Parse out the entities
            $lines = explode("\n", $response);
            $start = false;
            foreach ($lines as $line) {
                if (strpos($line, '-->') === 0) {
                    break;
                } elseif (strpos($line, '<!--') !== 0) {
                    $parts = explode(':', $line);
                    $type = $parts[0];
                    $entities = explode(',', $parts[1]);
                    foreach ($entities as $entity) {

                        if (strlen(trim($entity)) > 0)
                            $this->entities[$type][] = trim($entity);
                    }
                }
            }

            

            //Parse out the social tags
            if (strpos($response, '<SocialTag ') !== false) {
                preg_match_all('/<SocialTag [^>]*>([^<]*)<originalValue>/', $response, $matches);
                if (is_array($matches) && is_array($matches[1]) && count($matches[1]) > 0) {
                    foreach ($matches[1] as $tag) {
                        $this->entities['SocialTag'][] = trim($tag);
                    }
                }
            }
        }
        
    
        

    }

}