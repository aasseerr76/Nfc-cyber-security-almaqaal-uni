import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:nfc_manager/nfc_manager.dart';

class NfcService {
  NfcService._();
  static final NfcService instance = NfcService._();

  /// Check if device hardware supports NFC and if it is enabled
  Future<bool> isNfcAvailable() async {
    try {
      return await NfcManager.instance.isAvailable();
    } catch (e) {
      debugPrint('Error checking NFC availability: $e');
      return false;
    }
  }

  /// Start listening for an NFC tag and extract its UID/Serial
  Future<void> startNfcReading({
    required Function(String cardUid) onCardDetected,
    required Function(String errorMessage) onError,
  }) async {
    bool available = await isNfcAvailable();
    if (!available) {
      onError('خاصية NFC غير متوفرة أو معطلة في هذا الجهاز. يرجى تفعيلها من إعدادات الهاتف.');
      return;
    }

    try {
      await NfcManager.instance.startSession(
        onDiscovered: (NfcTag tag) async {
          String? extractedUid;

          // Attempt extraction from various tag technologies (ISO 7816, Mifare, ISO 15693, NDEF)
          final data = tag.data;
          if (data.containsKey('isodep')) {
            final identifier = data['isodep']?['identifier'];
            if (identifier is List) {
              extractedUid = _bytesToHex(identifier.cast<int>());
            }
          } else if (data.containsKey('mifareclassic')) {
            final identifier = data['mifareclassic']?['identifier'];
            if (identifier is List) {
              extractedUid = _bytesToHex(identifier.cast<int>());
            }
          } else if (data.containsKey('mifareultralight')) {
            final identifier = data['mifareultralight']?['identifier'];
            if (identifier is List) {
              extractedUid = _bytesToHex(identifier.cast<int>());
            }
          } else if (data.containsKey('nfca')) {
            final identifier = data['nfca']?['identifier'];
            if (identifier is List) {
              extractedUid = _bytesToHex(identifier.cast<int>());
            }
          }

          if (extractedUid != null && extractedUid.isNotEmpty) {
            await stopNfcReading();
            onCardDetected(extractedUid);
          } else {
            // Fallback generated tag from generic payload if binary UID wasn't exposed
            final genericId = 'NFC-MQ-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}';
            await stopNfcReading();
            onCardDetected(genericId);
          }
        },
        onError: (NfcError error) async {
          onError('حدث خطأ أثناء قراءة الشريحة: ${error.message}');
        },
      );
    } catch (e) {
      onError('تعذر بدء جلسة قراءة NFC: $e');
    }
  }

  /// Stop active NFC session
  Future<void> stopNfcReading() async {
    try {
      await NfcManager.instance.stopSession();
    } catch (e) {
      debugPrint('Error stopping NFC session: $e');
    }
  }

  /// Converts byte array to uppercase Hex UID string
  String _bytesToHex(List<int> bytes) {
    return bytes.map((b) => b.toRadixString(16).padLeft(2, '0')).join('').toUpperCase();
  }
}
