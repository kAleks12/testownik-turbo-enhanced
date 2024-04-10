package main

import "testing"

func TestHello(t *testing.T) {
	x := 10
	y := 10
	if x != y {
		t.Fatalf("Error occured")
	}
}
