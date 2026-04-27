package com.coloryxrn

import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import android.text.SpannableString
import android.text.Spanned
import android.text.style.ForegroundColorSpan
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class LaunchActivity : AppCompatActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_launch)

    val titleView = findViewById<TextView>(R.id.launchTitle)
    val title = SpannableString("Coloryx")

    // Match iOS launch screen title colors.
    title.setSpan(ForegroundColorSpan(Color.WHITE), 0, 5, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
    title.setSpan(ForegroundColorSpan(Color.parseColor("#c4b5fd")), 5, 6, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
    title.setSpan(ForegroundColorSpan(Color.parseColor("#5eead4")), 6, 7, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
    titleView.text = title

    startActivity(Intent(this, MainActivity::class.java))
    finish()
  }
}
